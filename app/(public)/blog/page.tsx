import Link from "next/link";
import Image from "next/image";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export const metadata = {
  title: "Expert Home Care Blog & Guides | Homesdecorator",
  description: "Read technical guides on waterproofing, wood floor selections, wall paint shades, and dampness protection tips from our field engineers.",
};

export default async function BlogPage() {
  let posts: any[] = [];

  try {
    await connectToDatabase();
    const dbPosts = await BlogPost.find({}).sort({ publishedAt: -1 }).lean();
    posts = dbPosts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      publishedAt: p.publishedAt?.toISOString() || null,
      createdAt: p.createdAt?.toISOString() || null,
      updatedAt: p.updatedAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to query blog posts:", err);
  }

  // Fallback posts if database is empty
  if (posts.length === 0) {
    posts = [
      {
        title: "Top 5 Seepage Causes in Indian Homes & How to Fix Them",
        slug: "top-5-seepage-causes-indian-homes",
        coverImage: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800",
        excerpt: "Seepage and dampness ruin your home's aesthetics and structural integrity. Learn about the primary causes and long-term scientific solutions.",
        category: "waterproofing",
        publishedAt: new Date().toISOString(),
        author: "Homesdecorator Team",
      },
      {
        title: "Complete Guide to Choosing Between Laminate, SPC, and Engineered Wood",
        slug: "guide-choosing-laminate-spc-engineered-wood",
        coverImage: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=800",
        excerpt: "Compare flooring options based on cost, durability, water resistance, and aesthetics to make the right choice for your next home renovation.",
        category: "wooden-flooring",
        publishedAt: new Date().toISOString(),
        author: "Homesdecorator Team",
      }
    ];
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary">
            Home Care Blog & Expert Guides
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Expert knowledge and guidebooks on structural waterproofing, flooring parameters, and shade configurations compiled by our on-site engineers.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {posts.map((post) => {
            const coverUrl = typeof post.coverImage === "string"
              ? post.coverImage
              : (post.coverImage?.url || "");
            const coverAlt = typeof post.coverImage === "string"
              ? post.title
              : (post.coverImage?.altText || post.title);

            return (
              <article key={post.slug} className="bg-white border border-slate-150/70 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group">
                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                  {/* Image */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0">
                    <Image
                      src={coverUrl}
                      alt={coverAlt}
                      fill
                      className="object-cover group-hover:scale-102 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm text-dark px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow">
                      {post.category}
                    </div>
                  </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Metadata */}
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }) : ""}
                      </span>
                      <span className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1" />
                        {post.author}
                      </span>
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-200 leading-snug">
                      {post.title}
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <span className="inline-flex items-center text-xs sm:text-sm font-bold text-primary group-hover:text-accent pt-4 border-t border-slate-100 mt-auto transition-colors duration-200">
                    Read Full Article <ArrowRight className="w-4 h-4 ml-1.5" />
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      </div>
    </div>
  );
}
