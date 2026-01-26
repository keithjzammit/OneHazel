// OneHazel HubSpot Sync Edge Function
// This function is triggered when a new lead registers
// It creates or updates a contact in HubSpot CRM

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper function to split full name into first and last name
function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const nameParts = fullName.trim().split(" ");

  if (nameParts.length === 1) {
    return { firstName: nameParts[0], lastName: "" };
  }

  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return { firstName, lastName };
}

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request body
    const {
      lead_id,
      email,
      full_name,
      company_name,
      job_title,
      phone_number,
      business_sector,
    } = await req.json();

    console.log(`Processing lead: ${email} (ID: ${lead_id})`);

    // Validate required fields
    if (!lead_id || !email || !full_name) {
      throw new Error("Missing required fields: lead_id, email, full_name");
    }

    // Get HubSpot access token from environment
    const hubspotToken = Deno.env.get("HUBSPOT_ACCESS_TOKEN");
    if (!hubspotToken) {
      throw new Error("HUBSPOT_ACCESS_TOKEN not configured");
    }

    // Split full name into first and last name
    const { firstName, lastName } = splitFullName(full_name);

    // Prepare HubSpot contact properties
    const hubspotContact = {
      properties: {
        email: email,
        firstname: firstName,
        lastname: lastName,
        company: company_name || "",
        jobtitle: job_title || "",
        phone: phone_number || "",
        industry: business_sector || "",
        // Custom properties (optional - create these in HubSpot if needed)
        // onehazel_lead_id: lead_id,
        // lead_source: "OneHazel Registration Gate",
      },
    };

    console.log("Sending contact to HubSpot:", hubspotContact);

    // Call HubSpot API to create or update contact
    const hubspotResponse = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hubspotToken}`,
        },
        body: JSON.stringify(hubspotContact),
      }
    );

    const hubspotData = await hubspotResponse.json();

    // Check if contact already exists (409 conflict)
    if (hubspotResponse.status === 409) {
      console.log("Contact already exists, updating instead...");

      // Extract contact ID from error response
      const existingContactId = hubspotData.message?.match(/contact already exists. Existing ID: (\d+)/)?.[1];

      if (existingContactId) {
        // Update existing contact
        const updateResponse = await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/${existingContactId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${hubspotToken}`,
            },
            body: JSON.stringify(hubspotContact),
          }
        );

        const updateData = await updateResponse.json();

        if (!updateResponse.ok) {
          throw new Error(`HubSpot update failed: ${JSON.stringify(updateData)}`);
        }

        console.log("Successfully updated HubSpot contact:", existingContactId);

        // Update Supabase record
        await updateSupabaseRecord(lead_id, existingContactId);

        return new Response(
          JSON.stringify({
            success: true,
            action: "updated",
            hubspot_contact_id: existingContactId,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      } else {
        // Try to find contact by email and update
        const searchResponse = await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${hubspotToken}`,
            },
            body: JSON.stringify({
              filterGroups: [
                {
                  filters: [
                    {
                      propertyName: "email",
                      operator: "EQ",
                      value: email,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const searchData = await searchResponse.json();

        if (searchData.results && searchData.results.length > 0) {
          const contactId = searchData.results[0].id;

          // Update found contact
          const updateResponse = await fetch(
            `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${hubspotToken}`,
              },
              body: JSON.stringify(hubspotContact),
            }
          );

          const updateData = await updateResponse.json();

          if (!updateResponse.ok) {
            throw new Error(`HubSpot update failed: ${JSON.stringify(updateData)}`);
          }

          console.log("Successfully updated HubSpot contact:", contactId);

          // Update Supabase record
          await updateSupabaseRecord(lead_id, contactId);

          return new Response(
            JSON.stringify({
              success: true,
              action: "updated",
              hubspot_contact_id: contactId,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        }

        throw new Error("Contact exists but could not be found or updated");
      }
    }

    // Check for other errors
    if (!hubspotResponse.ok) {
      throw new Error(`HubSpot API error: ${JSON.stringify(hubspotData)}`);
    }

    const hubspotContactId = hubspotData.id;
    console.log("Successfully created HubSpot contact:", hubspotContactId);

    // Update Supabase record to mark as synced
    await updateSupabaseRecord(lead_id, hubspotContactId);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        action: "created",
        hubspot_contact_id: hubspotContactId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error syncing to HubSpot:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Helper function to update Supabase record
async function updateSupabaseRecord(leadId: string, hubspotContactId: string) {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from("leads")
      .update({
        synced_to_hubspot: true,
        hubspot_contact_id: hubspotContactId,
      })
      .eq("id", leadId);

    if (error) {
      throw error;
    }

    console.log("Updated Supabase record:", leadId);
  } catch (error) {
    console.error("Error updating Supabase:", error);
    // Don't throw - we don't want to fail the whole function if Supabase update fails
    // The HubSpot sync already succeeded
  }
}
