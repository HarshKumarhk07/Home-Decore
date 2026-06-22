import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Project from "@/models/Project";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();



  let stats = {
    totalLeads: 0,
    completedLeads: 0,
    pendingQuotes: 0,
    totalProjects: 0,
    conversionRate: 0,
  };

  let serviceData: { name: string; value: number }[] = [];
  let cityData: { name: string; value: number }[] = [];
  let monthlyData: { name: string; count: number }[] = [];

  try {
    await connectToDatabase();

    // 1. Calculate General counts
    const totalLeads = await Lead.countDocuments({});
    const completedLeads = await Lead.countDocuments({ status: "Completed" });
    const pendingQuotes = await Lead.countDocuments({
      status: { $in: ["New", "Contacted", "Inspection Scheduled"] },
    });
    const totalProjects = await Project.countDocuments({});
    const conversionRate = totalLeads > 0 ? Math.round((completedLeads / totalLeads) * 100) : 0;

    stats = { totalLeads, completedLeads, pendingQuotes, totalProjects, conversionRate };

    // 2. Aggregate Leads by Service
    const dbServiceData = await Lead.aggregate([
      { $group: { _id: "$service", count: { $sum: 1 } } },
    ]);
    serviceData = dbServiceData.map((d: any) => ({
      name: d._id || "Unspecified",
      value: d.count,
    }));

    // 3. Aggregate Leads by City
    const dbCityData = await Lead.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $limit: 5 } // Top 5 cities
    ]);
    cityData = dbCityData.map((d: any) => ({
      name: d._id || "General",
      value: d.count,
    }));

    // 4. Aggregate Leads by Month (last 6 months)
    const dbMonthlyData = await Lead.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthlyData = dbMonthlyData.map((d: any) => ({
      name: `${monthNames[d._id.month - 1]} ${d._id.year}`,
      count: d.count,
    }));
  } catch (error) {
    console.error("⚠️ Failed to aggregate dashboard statistics, using fallbacks:", error);
  }



  return (
    <DashboardClient
      stats={stats}
      serviceData={serviceData}
      cityData={cityData}
      monthlyData={monthlyData}
    />
  );
}
