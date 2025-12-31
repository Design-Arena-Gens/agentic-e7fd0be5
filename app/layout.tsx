import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart To-Do AI - Intelligent Task Management",
  description: "AI-powered to-do list that helps you organize, prioritize, and complete tasks efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
