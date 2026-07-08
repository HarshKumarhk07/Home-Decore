import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getServiceLocationPages } from "@/actions/cmsActions";
import ServicePagesClient from "./ServicePagesClient";

export const dynamic = "force-dynamic";

export default async function AdminServicePagesPage() {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    redirect("/admin/login");
  }

  const result = await getServiceLocationPages();
  const pagesList = result.success ? result.pages : [];

  return <ServicePagesClient initialPages={pagesList} />;
}
