import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectsClient from "./ProjectsClient";
import { fallbackProjects } from "@/lib/fallbackData";

export const revalidate = 60; // Revalidate every minute

export const metadata = {
  title: "Our Portfolio of Completed Projects | Home Decorater",
  description: "Browse our successfully completed waterproofing, flooring, and PVC projects in residential and commercial sectors.",
};

export default async function ProjectsPage() {
  let projects: any[] = [];

  try {
    await connectToDatabase();
    const dbProjects = await Project.find({}).sort({ completionDate: -1 }).lean();
    projects = dbProjects.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      completionDate: p.completionDate?.toISOString() || null,
      createdAt: p.createdAt?.toISOString() || null,
      updatedAt: p.updatedAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to query projects for page:", err);
  }

  // Fallback items if database is empty or connection fails
  if (projects.length === 0) {
    projects = fallbackProjects;
  }

  return <ProjectsClient initialProjects={projects} />;
}
