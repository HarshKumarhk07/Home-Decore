import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import FaqsClient from "./FaqsClient";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    redirect("/admin/login");
  }

  let faqsList: any[] = [];
  try {
    await connectToDatabase();
    const dbFaqs = await FAQ.find({}).sort({ createdAt: -1 }).lean();
    faqsList = dbFaqs.map((f: any) => ({
      ...f,
      _id: f._id.toString(),
      createdAt: f.createdAt?.toISOString() || null,
      updatedAt: f.updatedAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to query FAQs for CMS:", err);
  }

  return <FaqsClient initialFaqs={faqsList} />;
}
