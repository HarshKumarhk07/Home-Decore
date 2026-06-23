import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWidgets from "@/components/layout/FloatingWidgets";
import { Toaster } from "@/components/ui/sonner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Spacer to push content down below the sticky header */}
      <main className="flex-grow pt-[72px] lg:pt-[80px]">
        {children}
      </main>
      <Footer />
      <FloatingWidgets />
      <Toaster richColors position="top-right" />
    </div>
  );
}
