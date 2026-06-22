import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    redirect("/admin/login");
  }

  let blogList: any[] = [];
  try {
    await connectToDatabase();
    const dbPosts = await BlogPost.find({}).sort({ publishedAt: -1 }).lean();
    blogList = dbPosts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      publishedAt: p.publishedAt?.toISOString() || null,
      createdAt: p.createdAt?.toISOString() || null,
      updatedAt: p.updatedAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to query blog posts for CMS:", err);
  }

  return <BlogClient initialPosts={blogList} />;
}
