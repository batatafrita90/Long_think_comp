import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "MCQ Platform",
  description: "Multi-service MCQ generation and delivery platform.",
};

const navLinks: Array<{ href: string; label: string }> = [
  { href: "/", label: "Overview" },
  { href: "/upload", label: "Upload" },
  { href: "/sessions", label: "Sessions" },
  { href: "/history", label: "History" },
  { href: "/metrics", label: "Metrics" },
  { href: "/configuration", label: "Configuration" },
];

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="flex min-h-screen flex-col">
          <header className="border-b bg-white">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
              <span className="text-lg font-semibold tracking-tight">
                MCQ Platform Console
              </span>
              <nav className="flex items-center gap-4 text-sm font-medium text-neutral-600">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded px-2 py-1 transition hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
            {children}
          </main>
          <footer className="border-t bg-white">
            <div className="mx-auto w-full max-w-6xl px-6 py-4 text-xs text-neutral-500">
              Microserviços coordenados via NATS JetStream, Supabase e
              workflow-agentes. Sessões em tempo real expostas pelo
              quiz-session-service.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
