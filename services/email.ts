import { env } from "@/lib/env";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Helper function to send email via Brevo API
async function sendEmail({
  to,
  subject,
  htmlContent,
}: {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}) {
  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Homesdecorator", email: env.MAIL_FROM },
        to,
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Brevo API returned error status ${response.status}:`, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Failed to send email via Brevo:", error);
    return false;
  }
}

// 1. Send Free Quote lead alerts
export async function sendLeadEmails(lead: any): Promise<boolean> {
  const adminEmail = env.MAIL_FROM;

  // HTML content for Admin Alert
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6;">
      <h2 style="color: #1e40af; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">New Quote Request Alert</h2>
      <p>A new customer lead has been generated with unique <strong>Lead ID: ${lead.leadId}</strong>.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background: #f8fafc;">
          <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Lead Parameter</th>
          <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Details</th>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Customer Name</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${lead.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Phone</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${lead.phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Email</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${lead.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Service Requested</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${lead.service}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Property Type</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${lead.propertyType}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">City & Address</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${lead.city || ""}, ${lead.address}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Area Covered (Sq Ft)</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${lead.area} Sq Ft</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Budget</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">₹${lead.budget}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Preferred Visit</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${new Date(lead.preferredDate).toLocaleDateString()} at ${lead.preferredTime}</td>
        </tr>
      </table>
      
      ${lead.images.length > 0 ? `
        <h3 style="margin-top: 20px; color: #1e40af;">Uploaded Site Images</h3>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
          ${lead.images.map((img: string) => `<img src="${img}" style="width: 150px; height: 100px; object-cover: cover; border-radius: 8px; border: 1px solid #e2e8f0;" />`).join("")}
        </div>
      ` : ""}
      
      <p style="margin-top: 30px; font-size: 12px; color: #64748b;">This inquiry has been logged in your Admin CRM Panel. Login to update status, add timeline notes, or assign inspectors.</p>
    </div>
  `;

  // HTML content for Customer Confirmation
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6; border: 1px solid #f1f5f9; padding: 25px; border-radius: 16px; margin: auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #1e40af;">Home <span style="color: #d4af37;">Decorater</span></span>
        <p style="font-size: 10px; text-transform: uppercase; tracking: 0.15em; color: #64748b; margin-top: 5px;">Specialized Waterproofing & Flooring</p>
      </div>

      <h2 style="color: #1e40af; text-align: center;">Inquiry Received Successfully!</h2>
      <p>Dear ${lead.customerName},</p>
      <p>Thank you for requesting a free quote from Homesdecorator. We have generated a unique lead log for you:</p>
      
      <div style="background: #eff6ff; padding: 15px; border-radius: 10px; border-left: 4px solid #d4af37; margin: 20px 0; text-align: center;">
        <span style="font-size: 14px; text-transform: uppercase; color: #1e40af; font-weight: bold; display: block;">Your Lead ID</span>
        <strong style="font-size: 22px; color: #1e40af;">${lead.leadId}</strong>
      </div>

      <p><strong>What happens next?</strong></p>
      <ol style="padding-left: 20px; font-size: 14px;">
        <li style="margin-bottom: 8px;">Our site engineer will review your requirements and photos.</li>
        <li style="margin-bottom: 8px;">We will contact you shortly to confirm the scheduled inspection on <strong>${new Date(lead.preferredDate).toLocaleDateString()}</strong>.</li>
        <li style="margin-bottom: 8px;">Post inspection, we will deliver your written square-foot quotation and warranty projection terms.</li>
      </ol>
      
      <p style="font-size: 14px;">If you have immediate questions, call us at <strong>+91 99999 99999</strong>.</p>
      
      <div style="border-t: 1px solid #f1f5f9; margin-top: 30px; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
        © ${new Date().getFullYear()} Homesdecorator. Noida Sector 62 Office.
      </div>
    </div>
  `;

  // Send to Admin
  await sendEmail({
    to: [{ email: adminEmail, name: "Homesdecorator Admin" }],
    subject: `[New Lead Alert] ID: ${lead.leadId} - ${lead.customerName} (${lead.service})`,
    htmlContent: adminHtml,
  });

  // Send to Customer
  return await sendEmail({
    to: [{ email: lead.email, name: lead.customerName }],
    subject: `Quote Request Confirmation - Lead ID: ${lead.leadId} | Homes`,
    htmlContent: customerHtml,
  });
}

// 2. Send Contact Form alerts
export async function sendContactEmail(inquiry: any): Promise<boolean> {
  const adminEmail = env.MAIL_FROM;

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6;">
      <h2 style="color: #1e40af; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Contact Inquiry Alert</h2>
      <p>A new general message has been received from the website contact page (Lead ID: ${inquiry.leadId}).</p>
      <p><strong>Sender Name:</strong> ${inquiry.name}</p>
      <p><strong>Phone:</strong> ${inquiry.phone}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Subject:</strong> ${inquiry.subject}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f8fafc; border-left: 4px solid #1e40af; padding: 12px; margin: 10px 0; font-style: italic;">
        ${inquiry.message}
      </blockquote>
    </div>
  `;

  return await sendEmail({
    to: [{ email: adminEmail, name: "Homesdecorator Admin" }],
    subject: `[Contact Form Submission] ${inquiry.subject} - ${inquiry.name}`,
    htmlContent: adminHtml,
  });
}

// 3. Send Inspection Scheduled alerts
export async function sendInspectionEmail(booking: any): Promise<boolean> {
  const adminEmail = env.MAIL_FROM;

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6;">
      <h2 style="color: #1e40af; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">New Site Inspection Scheduled</h2>
      <p>A customer has booked a site inspection check (Lead ID: ${booking.leadId}).</p>
      
      <ul>
        <li><strong>Name:</strong> ${booking.name}</li>
        <li><strong>Phone:</strong> ${booking.phone}</li>
        <li><strong>Email:</strong> ${booking.email}</li>
        <li><strong>Address:</strong> ${booking.address}</li>
        <li><strong>Service:</strong> ${booking.service}</li>
        ${booking.subService ? `<li><strong>Sub-Service / Treatment:</strong> ${booking.subService}</li>` : ""}
        <li><strong>Preferred Date:</strong> ${booking.preferredDate}</li>
        <li><strong>Preferred Time Slot:</strong> ${booking.preferredTime}</li>
        <li><strong>Remarks:</strong> ${booking.remarks || "None"}</li>
      </ul>
    </div>
  `;

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6; padding: 25px; border: 1px solid #f1f5f9; border-radius: 16px;">
      <h2 style="color: #1e40af; text-align: center;">Site Inspection Scheduled</h2>
      <p>Dear ${booking.name},</p>
      <p>Thank you for scheduling a technical inspection with us. Here are your appointment details:</p>
      
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Lead ID:</strong> ${booking.leadId}</p>
        <p style="margin: 5px 0;"><strong>Service:</strong> ${booking.service}</p>
        ${booking.subService ? `<p style="margin: 5px 0;"><strong>Sub-Service / Treatment:</strong> ${booking.subService}</p>` : ""}
        <p style="margin: 5px 0;"><strong>Date:</strong> ${booking.preferredDate}</p>
        <p style="margin: 5px 0;"><strong>Time Slot:</strong> ${booking.preferredTime}</p>
        <p style="margin: 5px 0;"><strong>Address:</strong> ${booking.address}</p>
      </div>
      
      <p>Our field representative will contact you shortly to confirm travel details. Site inspection and moisture level scanning are completely free of charge.</p>
    </div>
  `;

  // Send to Admin
  await sendEmail({
    to: [{ email: adminEmail, name: "Homesdecorator Admin" }],
    subject: `[Inspection Scheduled] Lead ID: ${booking.leadId} - ${booking.name}`,
    htmlContent: adminHtml,
  });

  // Send to Customer
  return await sendEmail({
    to: [{ email: booking.email, name: booking.name }],
    subject: `Inspection Scheduled Confirmation - Lead ID: ${booking.leadId} | Homes`,
    htmlContent: customerHtml,
  });
}
