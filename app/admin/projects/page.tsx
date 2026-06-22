import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    redirect("/admin/login");
  }

  let projectsList: any[] = [];
  try {
    await connectToDatabase();
    const dbProjects = await Project.find({}).sort({ createdAt: -1 }).lean();
    projectsList = dbProjects.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      completionDate: p.completionDate?.toISOString() || null,
      createdAt: p.createdAt?.toISOString() || null,
      updatedAt: p.updatedAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to query projects for CMS:", err);
  }

  return <ProjectsClient initialProjects={projectsList} />;
}
