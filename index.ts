import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DemoRequestData {
  name: string;
  email: string;
  phone: string;
  institution: string;
  role: string;
  hostelCount: string;
  message?: string;
}

const roleLabels: Record<string, string> = {
  warden: "Hostel Warden",
  admin: "Hostel Administrator",
  principal: "Principal/Director",
  it: "IT Department",
  owner: "PG/Hostel Owner",
  other: "Other",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: DemoRequestData = await req.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.institution || !data.role || !data.hostelCount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const roleLabel = roleLabels[data.role] || data.role;

    // Send email to the admin
    const emailResponse = await resend.emails.send({
      from: "SyncRoomies <onboarding@resend.dev>",
      to: ["Misc@entelika.com"],
      subject: `🏨 New Demo Request from ${data.institution}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f766e, #14b8a6); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🏨 New Demo Request</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">SyncRoomies - Roommate Matching Platform</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
            <h2 style="color: #0f766e; margin-top: 0; font-size: 18px;">Contact Information</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569; width: 140px;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;"><a href="mailto:${data.email}" style="color: #0f766e;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;"><a href="tel:${data.phone}" style="color: #0f766e;">${data.phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Institution:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 600;">${data.institution}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Role:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${roleLabel}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Number of Hostels:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${data.hostelCount}</td>
              </tr>
            </table>

            ${data.message ? `
              <h2 style="color: #0f766e; margin-top: 25px; font-size: 18px;">Additional Message</h2>
              <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #475569; line-height: 1.6;">${data.message}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="background: #0f766e; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">
              Respond within 24 hours to maintain a good lead conversion rate.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Demo request email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-demo-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
