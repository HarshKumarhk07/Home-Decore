import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectsClient from "./ProjectsClient";
import { fallbackProjects } from "@/lib/fallbackData";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const dynamic = "force-dynamic"; // Always fresh so admin image changes reflect immediately

export const metadata = {
  title: "Our Portfolio of Completed Projects",
  description: "Browse Homes Decorator's successfully completed waterproofing, flooring, and PVC projects across residential and commercial sites in Haryana & Delhi NCR.",
  alternates: { canonical: "/projects" },
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

  return (
    <>
      <div className="bg-slate-50 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
            ]}
          />
        </div>
      </div>
      <ProjectsClient initialProjects={projects} />
    </>
  );
}
