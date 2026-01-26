// OneHazel Registration Edge Function
// This function handles lead registration WITHOUT exposing any Supabase credentials to the client
// All database operations and HubSpot sync happen server-side

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate phone
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, "");
  return phoneRegex.test(phone) && digitsOnly.length >= 10;
}

// Helper function to split full name
function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const nameParts = fullName.trim().split(" ");
  if (nameParts.length === 1) {
    return { firstName: nameParts[0], lastName: "" };
  }
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");
  return { firstName, lastName };
}

// Sync to HubSpot
async function syncToHubSpot(leadData: any): Promise<string | null> {
  try {
    const hubspotToken = Deno.env.get("HUBSPOT_ACCESS_TOKEN");
    if (!hubspotToken) {
      console.error("HUBSPOT_ACCESS_TOKEN not configured");
      return null;
    }

    const { firstName, lastName } = splitFullName(leadData.full_name);

    const hubspotContact = {
      properties: {
        email: leadData.email,
        firstname: firstName,
        lastname: lastName,
        company: leadData.company_name || "",
        jobtitle: leadData.job_title || "",
        phone: leadData.phone_number || "",
        industry: leadData.business_sector || "",
      },
    };

    // Try to create contact
    let response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${hubspotToken}`,
      },
      body: JSON.stringify(hubspotContact),
    });

    let data = await response.json();

    // If contact exists, update it
    if (response.status === 409) {
      console.log("Contact exists, searching to update...");

      // Search for contact by email
      const searchResponse = await fetch(
        "https://api.hubapi.com/crm/v3/objects/contacts/search",
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
                    value: leadData.email,
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

        // Update existing contact
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

        if (updateResponse.ok) {
          console.log("Updated HubSpot contact:", contactId);
          return contactId;
        }
      }

      return null;
    }

    if (response.ok) {
      console.log("Created HubSpot contact:", data.id);
      return data.id;
    }

    console.error("HubSpot API error:", data);
    return null;
  } catch (error) {
    console.error("Error syncing to HubSpot:", error);
    return null;
  }
}

// Main handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request body
    const {
      email,
      full_name,
      company_name,
      job_title,
      phone_number,
      business_sector,
    } = await req.json();

    // Validate required fields
    if (!email || !full_name || !company_name || !job_title || !phone_number || !business_sector) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "All fields are required",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid email format",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Validate phone
    if (!isValidPhone(phone_number)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid phone number (minimum 10 digits)",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Initialize Supabase with SERVICE ROLE (server-side only)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Processing registration for: ${email}`);

    // Insert into database
    const { data: leadData, error: dbError } = await supabase
      .from("leads")
      .insert([
        {
          email,
          full_name,
          company_name,
          job_title,
          phone_number,
          business_sector,
        },
      ])
      .select()
      .single();

    // Handle duplicate email
    if (dbError?.code === "23505") {
      console.log("Email already registered:", email);

      // Still return success (user is already registered)
      return new Response(
        JSON.stringify({
          success: true,
          message: "This email is already registered. Welcome back!",
          already_registered: true,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Registration failed. Please try again.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Lead saved to database:", leadData.id);

    // Sync to HubSpot (non-blocking, we don't wait for it)
    const hubspotContactId = await syncToHubSpot(leadData);

    // Update database with HubSpot sync status
    if (hubspotContactId) {
      await supabase
        .from("leads")
        .update({
          synced_to_hubspot: true,
          hubspot_contact_id: hubspotContactId,
        })
        .eq("id", leadData.id);

      console.log("HubSpot sync successful");
    } else {
      console.log("HubSpot sync failed (will retry later)");
    }

    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        message: "Registration successful!",
        lead_id: leadData.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unexpected error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
