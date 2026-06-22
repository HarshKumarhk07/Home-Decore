import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    redirect("/admin/login");
  }

  let photosList: any[] = [];
  try {
    await connectToDatabase();
    const dbPhotos = await Gallery.find({}).sort({ createdAt: -1 }).lean();
    photosList = dbPhotos.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString() || null,
      updatedAt: p.updatedAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to query gallery items for CMS:", err);
  }

  return <GalleryClient initialPhotos={photosList} />;
}
