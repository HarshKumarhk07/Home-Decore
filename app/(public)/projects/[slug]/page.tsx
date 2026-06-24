import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";

import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ShieldCheck, Wrench, Clock, Maximize2, User, ChevronLeft } from "lucide-react";
import { fallbackProjects } from "@/lib/fallbackData";

export const revalidate = 60; // Revalidate every minute

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    await connectToDatabase();
    let project = await Project.findOne({ slug }).lean();
    if (!project) {
      project = fallbackProjects.find((p) => p.slug === slug) as any;
    }
    if (!project) return { title: "Project Not Found | Home Decorater" };
    return {
      title: `${project.title} | Home Decorater Projects`,
      description: project.description.substring(0, 160),
    };
  } catch (err) {
    // If connection fails, check fallback
    const project = fallbackProjects.find((p) => p.slug === slug);
    if (project) {
      return {
        title: `${project.title} | Home Decorater Projects`,
        description: project.description.substring(0, 160),
      };
    }
    return { title: "Project Details | Home Decorater" };
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  let project: any = null;

  try {
    await connectToDatabase();
    const dbProject = await Project.findOne({ slug }).lean();
    if (dbProject) {
      project = {
        ...dbProject,
        _id: dbProject._id.toString(),
        completionDate: dbProject.completionDate?.toISOString() || null,
        createdAt: dbProject.createdAt?.toISOString() || null,
        updatedAt: dbProject.updatedAt?.toISOString() || null,
      };
    }
  } catch (err) {
    console.error("Error querying project detail:", err);
  }

  // Fallback to local mockup array if not found in database (e.g. database unseeded/connection error)
  if (!project) {
    project = fallbackProjects.find((p) => p.slug === slug) || null;
  }

  if (!project) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homedecorater.in";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.images,
    "creator": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Home Decorater",
      "url": baseUrl
    },
    "contentLocation": {
      "@type": "Place",
      "name": project.location
    },
    "dateCreated": project.completionDate || project.createdAt
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link href="/projects" className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-primary mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Projects
        </Link>

        {/* Title */}
        <div className="space-y-4 mb-10">
          <div className="inline-block bg-accent/25 border border-accent/20 text-slate-900 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
            {project.category.replace("-", " ")}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary leading-tight">
            {project.title}
          </h1>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Main Image */}
            <div className="relative h-[300px] sm:h-[450px] rounded-3xl overflow-hidden shadow-md">
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
            </div>



            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-primary">Project Description</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Sub images (if present) */}
            {project.images.length > 1 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-primary pl-1">Project Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.images.map((img: string, idx: number) => (
                    <div key={idx} className="relative h-32 sm:h-44 rounded-2xl overflow-hidden shadow-sm group">
                      <Image
                        src={img}
                        alt={`${project.title} gallery item`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 300px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Project Details Sidebar */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-primary border-b border-slate-100 pb-4">
                Project Parameters
              </h3>
              
              <ul className="space-y-4 text-sm">
                <li className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="font-semibold text-slate-800">{project.location}</p>
                  </div>
                </li>
                {project.clientName && (
                  <li className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Client</p>
                      <p className="font-semibold text-slate-800">{project.clientName}</p>
                    </div>
                  </li>
                )}
                <li className="flex items-center space-x-3">
                  <Maximize2 className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Area Covered</p>
                    <p className="font-semibold text-slate-800">{project.areaCovered}</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Duration</p>
                    <p className="font-semibold text-slate-800">{project.duration}</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Warranty</p>
                    <p className="font-semibold text-slate-800">{project.warranty}</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Completion Date</p>
                    <p className="font-semibold text-slate-800">
                      {project.completionDate ? new Date(project.completionDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : "Completed"}
                    </p>
                  </div>
                </li>
              </ul>

              {/* Materials list */}
              {project.materialsUsed?.length > 0 && (
                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <h4 className="font-serif font-bold text-slate-800 text-sm">Brand Materials Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.materialsUsed.map((mat: string) => (
                      <span key={mat} className="bg-primary-light text-primary border border-primary/10 text-xs px-3 py-1 rounded-lg font-medium">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar CTA */}
            <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-6">
              <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug">
                Require Similar Quality Work?
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Connect with our field engineers to schedule a moisture scan or check flooring samples.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl py-3 text-sm">
                  <Link href="/inspection">Book Site Inspection</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary rounded-xl py-3 text-sm">
                  <Link href="/quote">Request Custom Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
