import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ServicesClient from "./ServicesClient";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    redirect("/admin/login");
  }

  return <ServicesClient />;
}
