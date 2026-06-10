import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/lib/lenis";
import { PageTransition } from "./_components/transition/PageTransition";
import { Navbar } from "./_components/nav/Navbar";
import { CustomCursor } from "./_components/fx/CustomCursor";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Akshar Realty — Homes. Plots. Villas. Projects.",
  description: "Akshar Realty crafts landmark addresses across Mumbai, Pune, and the Konkan coast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`grain ${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body className="bg-ink font-body antialiased">
        <SmoothScrollProvider>
          <PageTransition>
            <Navbar />
            {children}
            <CustomCursor />
          </PageTransition>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
