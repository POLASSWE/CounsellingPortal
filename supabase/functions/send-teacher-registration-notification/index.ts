import { serve } from "std/server";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TeacherRejectionRequest {
  teacherName: string;
  teacherEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { teacherName, teacherEmail }: TeacherRejectionRequest = await req.json();

    const data = await resend.emails.send({
      from: "EduBook <onboarding@resend.dev>",
      to: [teacherEmail],
      subject: "Application Update",
      html: `
        <h1>Application Update</h1>
        <p>Hi ${teacherName},</p>
        <p>Thank you for your interest in EduBook. After reviewing your application, we regret to inform you that we cannot move forward with your profile at this time.</p>
        <p>If you have any questions, please contact support.</p>
      `,
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);