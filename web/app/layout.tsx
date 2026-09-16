import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SQL Engineering Lab — Static vs Dynamic SQL",
  description: "An interactive showcase of SQL execution, parameterized queries, relational modeling, and database security. Built with Python, MySQL, Next.js, and TypeScript.",
  keywords: ["SQL", "Static SQL", "Dynamic SQL", "Database", "DBMS", "Python", "MySQL", "Next.js"],
  openGraph: {
    title: "SQL Engineering Lab",
    description: "Interactive demonstration of Static SQL, Dynamic SQL, parameterization, and database security.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Navigation />
        <main className="flex-1 pt-[60px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
