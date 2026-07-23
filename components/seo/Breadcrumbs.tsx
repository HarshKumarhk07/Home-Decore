import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  name: string;
  path: string;
}

// Visual breadcrumb trail + matching BreadcrumbList JSON-LD.
// The last crumb renders as the current (non-linked) page.
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs sm:text-sm font-semibold text-slate-500"
      >
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={crumb.path} className="flex items-center gap-x-2">
              {isLast ? (
                <span className="text-slate-700 font-bold truncate max-w-[220px]">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.path}
                    className="hover:text-primary transition-colors"
                  >
                    {crumb.name}
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}

export default Breadcrumbs;
