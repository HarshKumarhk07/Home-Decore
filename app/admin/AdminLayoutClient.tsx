"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  FolderKanban,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

interface AdminLayoutClientProps {
  session: any;
  children: React.ReactNode;
}

export default function AdminLayoutClient({ session, children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/leads/notifications");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            // Trigger toast alert if count increases
            if (data.count > notificationCount && notificationCount > 0) {
              toast.info(`New Lead Submitted! (${data.count - notificationCount} new)`);
            }
            setNotificationCount(data.count);
            setRecentNotifications(data.recentLeads);
          }
        }
      } catch (err) {
        console.error("Failed to poll notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // Poll every 20 seconds
    return () => clearInterval(interval);
  }, [pathname, notificationCount]);

  // If on login page, render children directly without dashboard shell
  if (pathname === "/admin/login") {
    return (
      <>
        {children}
        <Toaster richColors position="top-right" />
      </>
    );
  }

  const userRole = session?.user?.role || "super_admin";
  const userName = session?.user?.name || "Admin User";

  // Sidebar Links config
  const sidebarLinks = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Manage Leads",
      href: "/admin/leads",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: <FolderKanban className="w-5 h-5" />,
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Gallery",
      href: "/admin/gallery",
      icon: <ImageIcon className="w-5 h-5" />,
    },
    {
      name: "Testimonials",
      href: "/admin/testimonials",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      name: "FAQs",
      href: "/admin/faqs",
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const roleLabel = "Super Admin";
  const roleBadgeColor = "bg-red-500/10 text-red-400 border border-red-500/20";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-4 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-accent animate-pulse" />
          <span className="font-serif text-lg font-bold text-white">
            Decorater<span className="text-accent">CRM</span>
          </span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-6 pt-6">
          {/* Logo Section */}
          <div className="px-6 pb-2 hidden md:block">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <ShieldCheck className="w-7 h-7 text-accent" />
              <div>
                <span className="font-serif text-lg font-bold text-white block leading-tight">
                  Decorater<span className="text-accent">CRM</span>
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                  Admin System
                </span>
              </div>
            </Link>
          </div>

          {/* User Card */}
          <div className="px-4 py-3 mx-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="p-2 bg-primary/20 text-accent rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white line-clamp-1">{userName}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold inline-block mt-0.5 ${roleBadgeColor}`}>
                {roleLabel}
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="px-3 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md border-l-4 border-accent"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sign Out Button */}
        <div className="p-4 border-t border-slate-800">
          <Button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            variant="ghost"
            className="w-full text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 justify-start rounded-xl px-4 py-3 text-sm cursor-pointer"
          >
            <LogOut className="w-5 h-5 mr-3 shrink-0" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Admin Panel Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="hidden md:flex items-center justify-between bg-slate-900/40 border-b border-slate-800/80 px-8 py-4 sticky top-0 backdrop-blur-md z-30">
          <h2 className="text-xl font-bold text-white font-serif">
            {sidebarLinks.find((l) => pathname === l.href)?.name || "Control Center"}
          </h2>
          
          <div className="flex items-center space-x-4">
            {/* Notification trigger button */}
            <div className="relative">
              <Button
                onClick={() => setShowDropdown(!showDropdown)}
                size="icon"
                variant="ghost"
                className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-dark text-[9px] font-extrabold rounded-full flex items-center justify-center border border-slate-900 animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </Button>

              {/* Notification Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 py-3 text-slate-200">
                  <div className="px-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      New Lead Alerts
                    </span>
                    <span className="text-[10px] bg-accent/25 text-accent px-2 py-0.5 rounded-full font-bold">
                      {notificationCount} New
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
                    {recentNotifications.map((notif: any) => (
                      <Link
                        key={notif.leadId}
                        href="/admin/leads"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-3 hover:bg-slate-800/50 transition-colors text-left"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono font-bold text-accent">{notif.leadId}</span>
                          <span className="text-[9px] text-slate-500">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white mt-1 line-clamp-1">
                          {notif.customerName}
                        </p>
                        <p className="text-[10px] text-slate-450">
                          Requested {notif.service}
                        </p>
                      </Link>
                    ))}

                    {recentNotifications.length === 0 && (
                      <div className="py-8 text-center text-xs text-slate-500">
                        No new lead notifications.
                      </div>
                    )}
                  </div>

                  <div className="px-4 pt-2 border-t border-slate-800 text-center">
                    <Link
                      href="/admin/leads"
                      onClick={() => setShowDropdown(false)}
                      className="text-[10px] font-bold text-accent hover:text-accent-hover uppercase tracking-wider block"
                    >
                      View All Leads
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
