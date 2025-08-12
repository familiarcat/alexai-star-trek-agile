import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "/public/assets/lcars.css";
import { LCARSLayout } from "@/components/lcars/lcars-layout";
import { ShipsComputerProvider } from "@/components/lcars/ships-computer-controller";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlexAI Star Trek Agile Management System",
  description: "AI-powered agile project management with authentic Star Trek LCARS interface",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ShipsComputerProvider>
          <LCARSLayout>
            {children}
          </LCARSLayout>
        </ShipsComputerProvider>
      </body>
    </html>
  );
}
