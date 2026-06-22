import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSettings } from "@/actions/cmsActions";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session || session.user.role !== "super_admin") {
    redirect("/admin/login");
  }

  const settingsResult = await getSettings();
  const settings = settingsResult.success ? settingsResult.settings : null;

  return <SettingsClient initialSettings={settings} />;
}
