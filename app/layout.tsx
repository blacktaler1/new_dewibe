import type { Metadata } from "next";
import localFont from "next/font/local";
import AppCursor from "@/components/AppCursor";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import "./globals.css";

const konect = localFont({
  src: "../public/fonts/konect-demo/KonectDemo-Regular.ttf",
  variable: "--font-konect",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "DEWIBE — Creative Design & Development Team",
  description:
    "DEWIBE is a multidisciplinary creative team building immersive digital experiences for startups and global brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${konect.variable}`}>
      <body className={konect.className}>
        <LanguageProvider>
          <AppCursor />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
