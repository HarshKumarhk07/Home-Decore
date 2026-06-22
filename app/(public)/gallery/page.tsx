import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import GalleryClient from "./GalleryClient";
import { fallbackGallery } from "@/lib/fallbackData";

export const revalidate = 60; // Revalidate every minute

export const metadata = {
  title: "Photo Gallery & Work Samples | Home Decorater",
  description: "Explore photos of our actual waterproofing processes, wooden flooring textures, and PVC installations completed on client sites.",
};

export default async function GalleryPage() {
  let items: any[] = [];

  try {
    await connectToDatabase();
    const dbItems = await Gallery.find({}).sort({ createdAt: -1 }).lean();
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

  return <GalleryClient initialItems={items} />;
}
