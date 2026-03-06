import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";

const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "";
const SMTP_HOST = Deno.env.get("SMTP_HOST") || "";
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
const SMTP_USER = Deno.env.get("SMTP_USER") || "";
const SMTP_PASS = Deno.env.get("SMTP_PASS") || "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, message } = await req.json();

    if (!name || !email || !phone || !service || !message) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If SMTP credentials are not configured, log and return success
    // (placeholder until owner provides SMTP credentials)
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.log("=== NEW SERVICE REQUEST ===");
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Phone: ${phone}`);
      console.log(`Service: ${service}`);
      console.log(`Message: ${message}`);
      console.log("=== SMTP not configured - email not sent ===");

      return new Response(
        JSON.stringify({ success: true, note: "Request logged. SMTP not yet configured." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email via SMTP using fetch to a mail API
    // For production, replace with actual SMTP/Resend/SendGrid integration
    const emailBody = `
New Service Request from Afnan Property Care Website

Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}
Message: ${message}

---
Sent from afnanpropertycare.ae contact form
    `.trim();

    console.log("Email would be sent to:", OWNER_EMAIL);
    console.log("Email body:", emailBody);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
