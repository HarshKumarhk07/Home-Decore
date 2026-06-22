import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLeads } from "@/actions/leadActions";
import LeadsClient from "./LeadsClient";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch leads
  const leadsResult = await getLeads();
  const leads = leadsResult.leads || [];

  const employees: any[] = [];

  return (
    <LeadsClient
      initialLeads={leads}
      employees={employees}
      currentUser={{
        id: session.user.id,
        role: session.user.role,
        name: session.user.username || session.user.name || "Admin",
      }}
    />
  );
}
