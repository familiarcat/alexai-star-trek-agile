import type { Metadata } from "next";
import "./globals.css";
import { ProperLCARSLayout } from "@/components/lcars/proper-lcars-layout";
import { ShipsComputerOrchestrator } from "@/components/lcars/ships-computer-orchestrator";
import { DynamicScalingProvider } from "@/components/lcars/dynamic-scaling-provider";



export const metadata: Metadata = {
  title: "AlexAI Agile Management System",
  description: "AI-powered agile project management with modern professional interface",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Antonio-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Antonio-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <DynamicScalingProvider>
          <ShipsComputerOrchestrator>
            <ProperLCARSLayout>
              {children}
            </ProperLCARSLayout>
          </ShipsComputerOrchestrator>
        </DynamicScalingProvider>
      </body>
    </html>
  );
}
