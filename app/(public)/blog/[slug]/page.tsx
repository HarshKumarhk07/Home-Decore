import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { Button } from "@/components/ui/button";
import { Calendar, User, ChevronLeft, ArrowRight, ShieldCheck, Mail } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    await connectToDatabase();
    const post = await BlogPost.findOne({ slug }).lean();
    if (!post) return { title: "Article Not Found | Homes" };
    return {
      title: `${post.title} | Homes Blog`,
      description: post.excerpt,
    };
  } catch (err) {
    return { title: "Blog Article | Homes" };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  let post: any = null;

  try {
    await connectToDatabase();
    const dbPost = await BlogPost.findOne({ slug }).lean();
    if (dbPost) {
      post = {
        ...dbPost,
        _id: dbPost._id.toString(),
        publishedAt: dbPost.publishedAt?.toISOString() || null,
        createdAt: dbPost.createdAt?.toISOString() || null,
        updatedAt: dbPost.updatedAt?.toISOString() || null,
      };
    }
  } catch (err) {
    console.error("Error querying blog details:", err);
  }

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homedecorater.in";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.coverImage,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "author": {
      "@type": "Organization",
      "name": post.author || "Homes Team",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Homes",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon.ico`
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-primary mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Blog
        </Link>

        {/* Article Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Article Body */}
          <article className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm space-y-6">
            {/* Category Tag */}
            <div className="inline-block bg-accent/25 border border-accent/20 text-slate-900 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
              {post.category}
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary leading-tight">
              {post.title}
            </h1>

            {/* Author / Date info */}
            <div className="flex items-center space-x-6 text-slate-500 text-xs sm:text-sm border-y border-slate-100 py-3">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : ""}
              </span>
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1.5 text-slate-400" />
                {post.author}
              </span>
            </div>

            {/* Main Image */}
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
            </div>

            {/* HTML/Markdown Content Wrapper */}
            <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-6 pt-4">
              {/* Process standard headings and lists basic styling manually */}
              {post.content.split("\n\n").map((block: string, i: number) => {
                if (block.startsWith("### ")) {
                  return (
                    <h3 key={i} className="font-serif text-xl sm:text-2xl font-bold text-primary pt-4">
                      {block.replace("### ", "")}
                    </h3>
                  );
                }
                if (block.startsWith("#### ")) {
                  return (
                    <h4 key={i} className="font-serif text-lg sm:text-xl font-bold text-slate-800 pt-2">
                      {block.replace("#### ", "")}
                    </h4>
                  );
                }
                if (block.startsWith("- ")) {
                  return (
                    <ul key={i} className="list-disc list-inside space-y-2 pl-4">
                      {block.split("\n").map((line, lIdx) => (
                        <li key={lIdx} className="text-slate-650">
                          {line.replace("- ", "").replace(/\*\*/g, "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="whitespace-pre-line text-slate-600">
                    {block.replace(/\*\*/g, "")}
                  </p>
                );
              })}
            </div>
          </article>

          {/* Sidebar CTA & Newsletter */}
          <div className="space-y-8">
            {/* Site Inspection Widget */}
            <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
              <div className="p-3 bg-white/10 rounded-2xl w-fit">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-serif text-xl font-bold leading-snug">
                Concerned About Wall Dampness?
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Schedule a 100% free moisture test. Our engineers locate hidden leaks using thermal scanners.
              </p>
              <div className="space-y-3 pt-2">
                <Button asChild className="w-full bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl py-3.5 text-sm">
                  <Link href="/inspection">Book Site Inspection</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary rounded-xl py-3.5 text-sm">
                  <Link href="/quote">Request Free Quote</Link>
                </Button>
              </div>
            </div>

            {/* Newsletter widget */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <Mail className="w-6 h-6 text-primary" />
              <h3 className="font-serif text-lg font-bold text-primary">Home Care Newsletter</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Subscribe to receive seasonal house waterproofing checklists and color paint recommendations once a month.
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <Button className="w-full bg-slate-900 hover:bg-primary text-white rounded-xl text-xs py-2.5">
                  Subscribe Now
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
