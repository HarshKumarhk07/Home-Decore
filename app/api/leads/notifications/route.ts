import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Lead from "@/models/Lead";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const query: any = { status: { $in: ["New", "Inspection Scheduled"] } };

    // Enforce Employee role restriction: Can only see their assigned new leads
    if (session.user.role === "employee") {
      query.assignedEmployee = session.user.id;
    }

    // Get count of new leads
    const count = await Lead.countDocuments(query);

    // Get the 5 most recent new leads
    const recentLeads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .select("leadId customerName service createdAt")
      .lean();

    return NextResponse.json({
      success: true,
      count,
      recentLeads: recentLeads.map((l: any) => ({
        leadId: l.leadId,
        customerName: l.customerName,
        service: l.service,
        createdAt: l.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("Notifications API error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch notifications" }, { status: 500 });
  }
}
