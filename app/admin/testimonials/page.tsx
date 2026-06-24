import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TestimonialsClient from "./TestimonialsClient";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    redirect("/admin/login");
  }

  return <TestimonialsClient />;
}
