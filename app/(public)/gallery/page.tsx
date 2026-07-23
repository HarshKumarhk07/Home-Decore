import { connectToDatabase } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import Gallery from "@/models/Gallery";
import GalleryClient from "./GalleryClient";
import { fallbackGallery } from "@/lib/fallbackData";

export const dynamic = "force-dynamic"; // Always fresh so admin image changes reflect immediately

export const metadata = {
  title: "Photo Gallery & Work Samples",
  description: "Explore photos of Homes Decorator's actual waterproofing processes, wooden flooring textures, and PVC installations completed on client sites across Haryana & Delhi NCR.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  let items: any[] = [];
  let isAdmin = false;

  // Check if user is admin
  try {
    const session = await auth();
    isAdmin = session?.user?.role === "super_admin" || session?.user?.role === "manager";
  } catch (err) {
    console.error("Error checking auth:", err);
  }

  try {
    await connectToDatabase();
    let dbItems = await Gallery.find({}).sort({ createdAt: -1 }).lean();

    // Seed default items into the database if empty
    if (dbItems.length === 0) {
      const itemsToInsert = fallbackGallery.map((item) => ({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      try {
        await Gallery.insertMany(itemsToInsert);
        dbItems = await Gallery.find({}).sort({ createdAt: -1 }).lean();
      } catch (seedErr) {
        console.error("Failed to seed fallback gallery items:", seedErr);
      }
    }

    items = dbItems.map((item: any) => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt?.toISOString() || null,
      updatedAt: item.updatedAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to query gallery items:", err);
  }

  // Fallback items in case database is empty or connection fails
  if (items.length === 0) {
    items = fallbackGallery;
  }

  return <GalleryClient initialItems={items} isAdmin={isAdmin} />;
}
