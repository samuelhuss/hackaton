import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DockSage } from "@/components/magicui/DockSage";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

// Fontes do projeto
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadados da aplicação
export const metadata: Metadata = {
  title: "SAGE AI",
  description: "Identifique componentes em diagramas de arquitetura com IA",
};

// Layout raiz da aplicação
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black min-h-screen`}
      >
        <DotPattern
        width={30}
        height={30}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />
        {/* Conteúdo principal da aplicação */}
        {children}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <DockSage />
        </div>
        <Toaster />

      </body>
    </html>
  );
}
