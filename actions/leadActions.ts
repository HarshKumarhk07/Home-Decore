"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Admin from "@/models/Admin";
import { ContactSchema, InspectionSchema, QuoteSchema } from "@/lib/schemas";
import { uploadToCloudinary } from "@/services/cloudinary";
import { sendLeadEmails, sendContactEmail, sendInspectionEmail } from "@/services/email";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/security";

// Helper function to generate sequential Lead ID
async function generateLeadId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

  const count = await Lead.countDocuments({
    createdAt: { $gte: startOfYear, $lte: endOfYear },
  });

  const nextNumber = (count + 1).toString().padStart(4, "0");
  return `HD-${currentYear}-${nextNumber}`;
}

// 1. Submit Contact Inquiry
export async function submitContactInquiry(rawFields: any) {
  try {
    const rateLimit = await checkRateLimit("contact-inquiry", 5, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return { success: false, message: "Too many submissions. Please try again in 10 minutes." };
    }

    const sanitizedFields = sanitizeInput(rawFields);
    const parsed = ContactSchema.safeParse(sanitizedFields);
    if (!parsed.success) {
      return { success: false, message: "Invalid form input." };
    }

    const { name, phone, email, city, service, message } = parsed.data;

    await connectToDatabase();
    const leadId = await generateLeadId();

    const lead = await Lead.create({
      leadId,
      customerName: name,
      phone,
      email,
      city,
      address: "Contact Form Submission",
      service,
      message,
      status: "New",
      images: [],
      notes: [{ text: `Lead created via Contact Form. Service: ${service}`, createdAt: new Date(), createdBy: "System" }],
      timeline: [{ status: "New", notes: "Lead generated via Contact Form", updatedAt: new Date(), updatedBy: "System" }],
    });

    // Send emails
    await sendContactEmail({ name, phone, email, city, service, message, leadId });

    revalidatePath("/admin/leads");
    return { success: true, message: "Message sent successfully!", leadId };
  } catch (error: any) {
    console.error("Error submitting contact inquiry:", error);
    return { success: false, message: error.message || "Failed to process request." };
  }
}

// 2. Submit Site Inspection Booking
export async function submitInspectionBooking(rawFields: any) {
  try {
    const rateLimit = await checkRateLimit("inspection-booking", 5, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return { success: false, message: "Too many submissions. Please try again in 10 minutes." };
    }

    const sanitizedFields = sanitizeInput(rawFields);
    const parsed = InspectionSchema.safeParse(sanitizedFields);
    if (!parsed.success) {
      return { success: false, message: "Invalid form input." };
    }

    const { name, phone, email, city, address, service, subService, preferredDate, preferredTime, remarks, source, sourceUrl, sourceSlug } = parsed.data;

    await connectToDatabase();
    const leadId = await generateLeadId();

    const lead = await Lead.create({
      leadId,
      customerName: name,
      phone,
      email,
      city: city || "",
      address,
      service,
      source: source || "Website",
      sourceUrl: sourceUrl || undefined,
      sourceSlug: sourceSlug || undefined,
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      preferredTime: preferredTime || undefined,
      message: subService ? `Treatment: ${subService}. Remarks: ${remarks || "None"}` : (remarks || "Requested Site Inspection"),
      status: "Inspection Scheduled",
      images: [],
      notes: [{ text: `Site inspection requested.${source ? ` Source: ${source}.` : ""} ${subService ? `Treatment: ${subService}. ` : ""}Remarks: ${remarks || "None"}`, createdAt: new Date(), createdBy: "System" }],
      timeline: [
        { status: "New", notes: "Lead generated via Inspection Booking", updatedAt: new Date(), updatedBy: "System" },
        { status: "Inspection Scheduled", notes: "Inspection request received", updatedAt: new Date(), updatedBy: "System" }
      ],
    });

    // Send emails
    await sendInspectionEmail({ ...rawFields, leadId });

    revalidatePath("/admin/leads");
    return { success: true, message: "Inspection scheduled successfully! Our team will contact you very soon. Thank you for choosing us.", leadId };
  } catch (error: any) {
    console.error("Error submitting inspection booking:", error);
    return { success: false, message: error.message || "Failed to schedule inspection." };
  }
}

// 3. Submit Free Quote Request (Multi-part Form Data for Files)
export async function submitQuoteRequest(formData: FormData) {
  try {
    const rateLimit = await checkRateLimit("quote-request", 5, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return { success: false, message: "Too many submissions. Please try again in 10 minutes." };
    }

    // Extract text fields
    const rawFields = {
      customerName: formData.get("customerName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      city: formData.get("city"),
      address: formData.get("address"),
      service: formData.get("service"),
      subService: formData.get("subService"),
      propertyType: formData.get("propertyType"),
      area: formData.get("area"),
      budget: formData.get("budget"),
      preferredDate: formData.get("preferredDate"),
      preferredTime: formData.get("preferredTime"),
      message: formData.get("message"),
    };

    const sanitizedFields = sanitizeInput(rawFields);
    const parsed = QuoteSchema.safeParse(sanitizedFields);
    if (!parsed.success) {
      return { success: false, message: "Invalid input variables. Check data inputs." };
    }

    const data = parsed.data;

    // Extract files
    const images: File[] = [];
    const files = formData.getAll("images");
    files.forEach((file) => {
      if (file instanceof File && file.size > 0) {
        images.push(file);
      }
    });

    // Upload files to Cloudinary
    const cloudinaryUrls: string[] = [];
    for (const file of images) {
      const url = await uploadToCloudinary(file);
      cloudinaryUrls.push(url);
    }

    await connectToDatabase();
    const leadId = await generateLeadId();

    const lead = await Lead.create({
      leadId,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      city: data.city,
      address: data.address,
      service: data.service,
      propertyType: data.propertyType,
      area: data.area,
      budget: data.budget,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : undefined,
      preferredTime: data.preferredTime || undefined,
      message: data.subService ? `Treatment: ${data.subService}. Remarks: ${data.message || "None"}` : (data.message || ""),
      images: cloudinaryUrls,
      status: "New",
      notes: [{ text: `Lead created via Quote Form.${data.subService ? ` Treatment: ${data.subService}.` : ""}`, createdAt: new Date(), createdBy: "System" }],
      timeline: [{ status: "New", notes: "Lead generated via Get Free Quote", updatedAt: new Date(), updatedBy: "System" }],
    });

    // Send confirmation emails
    await sendLeadEmails(lead);

    revalidatePath("/admin/leads");
    return { success: true, message: "Quote request submitted successfully!", leadId };
  } catch (error: any) {
    console.error("Error submitting quote request:", error);
    return { success: false, message: error.message || "Failed to process quote request." };
  }
}

// 4. Fetch leads for CRM dashboard (includes RBAC filters)
export async function getLeads(filters: { search?: string; service?: string; status?: string } = {}) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const query: any = {};

    // Enforce Employee role restriction: Can only see leads explicitly assigned to them
    if (session.user.role === "employee") {
      query.assignedEmployee = session.user.id;
    }

    // Apply Search filters (Lead ID, Name, Phone, Email)
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, "i");
      query.$or = [
        { leadId: searchRegex },
        { customerName: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
      ];
    }

    // Apply Service filter
    if (filters.service && filters.service !== "all") {
      query.service = filters.service;
    }

    // Apply Status filter
    if (filters.status && filters.status !== "all") {
      query.status = filters.status;
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .populate("assignedEmployee", "username email")
      .lean();

    return {
      success: true,
      leads: leads.map((l: any) => ({
        ...l,
        _id: l._id.toString(),
        assignedEmployee: l.assignedEmployee
          ? { _id: l.assignedEmployee._id.toString(), username: l.assignedEmployee.username, email: l.assignedEmployee.email }
          : null,
        preferredDate: l.preferredDate ? l.preferredDate.toISOString() : null,
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
        notes: l.notes.map((n: any) => ({ ...n, _id: n._id.toString(), createdAt: n.createdAt.toISOString() })),
        timeline: l.timeline.map((t: any) => ({ ...t, _id: t._id.toString(), updatedAt: t.updatedAt.toISOString() })),
      })),
    };
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    return { success: false, message: error.message || "Failed to retrieve leads." };
  }
}

// 5. Update Lead Status
export async function updateLeadStatus(leadId: string, status: any, notes: string) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    await connectToDatabase();
    const lead = await Lead.findOne({ leadId });
    if (!lead) throw new Error("Lead not found");

    // Employees can only update leads assigned to them
    if (session.user.role === "employee" && lead.assignedEmployee?.toString() !== session.user.id) {
      throw new Error("Access Denied: Not assigned to this lead.");
    }

    const updaterName = session.user.name || "Admin User";

    const sanitizedNotes = sanitizeInput(notes);
    const sanitizedStatus = sanitizeInput(status);

    // Update main status
    lead.status = sanitizedStatus;
    
    // Add timeline log
    lead.timeline.push({
      status: sanitizedStatus,
      notes: sanitizedNotes || `Status updated to ${sanitizedStatus}`,
      updatedAt: new Date(),
      updatedBy: updaterName,
    });

    // Also add as an internal note
    lead.notes.push({
      text: `Status updated to [${sanitizedStatus}]. Reason: ${sanitizedNotes || "None"}`,
      createdAt: new Date(),
      createdBy: updaterName,
    });

    await lead.save();

    revalidatePath("/admin/leads");
    return { success: true, message: `Lead status updated to ${status}` };
  } catch (error: any) {
    console.error("Error updating lead status:", error);
    return { success: false, message: error.message || "Failed to update status." };
  }
}

// 6. Add Custom Internal Note
export async function addLeadNote(leadId: string, noteText: string) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    await connectToDatabase();
    const lead = await Lead.findOne({ leadId });
    if (!lead) throw new Error("Lead not found");

    if (session.user.role === "employee" && lead.assignedEmployee?.toString() !== session.user.id) {
      throw new Error("Access Denied.");
    }

    const sanitizedNoteText = sanitizeInput(noteText);
    lead.notes.push({
      text: sanitizedNoteText,
      createdAt: new Date(),
      createdBy: session.user.name || "Admin User",
    });

    await lead.save();

    revalidatePath("/admin/leads");
    return { success: true, message: "Note added successfully" };
  } catch (error: any) {
    console.error("Error adding lead note:", error);
    return { success: false, message: error.message || "Failed to add note." };
  }
}

// 7. Assign Lead Employee (Super Admin Only)
export async function assignLeadEmployee(leadId: string, employeeId: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "super_admin") {
      throw new Error("Access Denied: Only Super Admin can assign employees.");
    }

    await connectToDatabase();
    const lead = await Lead.findOne({ leadId });
    if (!lead) throw new Error("Lead not found");

    let employeeName = "Unassigned";
    if (employeeId && employeeId !== "unassigned") {
      const empObj = await Admin.findById(employeeId);
      if (!empObj) throw new Error("Employee not found");
      lead.assignedEmployee = empObj._id as any;
      employeeName = empObj.username;
    } else {
      lead.assignedEmployee = undefined;
    }

    const updaterName = session.user.name || "Super Admin";

    lead.timeline.push({
      status: lead.status,
      notes: `Lead assigned to ${employeeName}`,
      updatedAt: new Date(),
      updatedBy: updaterName,
    });

    lead.notes.push({
      text: `Employee assignment changed to: ${employeeName}`,
      createdAt: new Date(),
      createdBy: updaterName,
    });

    await lead.save();

    revalidatePath("/admin/leads");
    return { success: true, message: `Lead successfully assigned to ${employeeName}` };
  } catch (error: any) {
    console.error("Error assigning employee:", error);
    return { success: false, message: error.message || "Failed to assign employee." };
  }
}

// 8. Delete Lead (Super Admin Only)
export async function deleteLead(leadId: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "super_admin") {
      throw new Error("Access Denied: Only Super Admin can delete leads.");
    }

    await connectToDatabase();
    const result = await Lead.deleteOne({ leadId });
    if (result.deletedCount === 0) {
      throw new Error("Lead not found");
    }

    revalidatePath("/admin/leads");
    return { success: true, message: "Lead deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting lead:", error);
    return { success: false, message: error.message || "Failed to delete lead." };
  }
}

// 9. Fetch Employees list for assignment (Super Admin Only)
export async function getEmployees() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "super_admin") {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const employees = await Admin.find({ role: "employee" }).select("username email").lean();

    return {
      success: true,
      employees: employees.map((e: any) => ({
        _id: e._id.toString(),
        username: e.username,
        email: e.email,
      })),
    };
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    return { success: false, message: error.message || "Failed to retrieve employee list." };
  }
}
