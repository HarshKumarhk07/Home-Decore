import { connectToDatabase } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import FaqClient from "./FaqClient";

export const revalidate = 60; // Revalidate every minute

export const metadata = {
  title: "Frequently Asked Questions | Homesdecorator",
  description: "Find answers regarding our site moisture assessments, structural waterproofing warranties, flooring installations, and PVC setups.",
};

export default async function FaqPage() {
  let list: any[] = [];

  try {
    await connectToDatabase();
    const dbFaqs = await FAQ.find({}).lean();
    list = dbFaqs.map((f: any) => ({
      ...f,
      _id: f._id.toString(),
      createdAt: f.createdAt?.toISOString() || null,
      updatedAt: f.updatedAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to query FAQs for page:", err);
  }

  // Fallback FAQs if database is empty
  if (list.length === 0) {
    list = [
      { question: "How long does your waterproofing treatment last?", answer: "We offer professional warranties ranging from 5 to 10 years depending on the service level selected, which covers cracking, seepage, and peeling of waterproofing membranes.", category: "waterproofing" },
      { question: "What is the difference between SPC and Laminate flooring?", answer: "SPC (Stone Plastic Composite) is 100% waterproof and highly stable, making it ideal for kitchens and areas with high moisture. Laminate is made of high-density wood fibers, giving a more authentic wood feel but is sensitive to excessive water.", category: "wooden-flooring" },
      { question: "Is PVC flooring suitable for hot temperatures?", answer: "Yes, our high-grade PVC (Polyvinyl Chloride) panels and SPC floorings are UV-stabilized and thermal-resistant, meaning they do not warp or expand under normal Indian summer temperatures.", category: "pvc" },
      { question: "Do you charge for a site inspection?", answer: "No, site inspections for evaluation, moisture testing, and quotation generation are completely free of charge. You can book an inspection from the website directly.", category: "general" }
    ];
  }

  return <FaqClient initialFaqs={list} />;
}
