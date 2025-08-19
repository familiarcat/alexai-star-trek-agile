import type { Metadata } from "next";
import "./globals.css";
import "./modern-design-system.css";
import { ProperLCARSLayout } from "@/core/components/lcars/proper-lcars-layout";
import { ShipsComputerOrchestrator } from "@/core/components/lcars/ships-computer-orchestrator";
import { DynamicScalingProvider } from "@/core/components/lcars/dynamic-scaling-provider";



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
        
        {/* Performance Monitoring Scripts - Chief Engineer Scott's recommendation */}
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize Performance Monitoring
              if (typeof window !== 'undefined') {
                window.performanceMonitoringActive = true;
                
                // Core Web Vitals tracking
                if ('performance' in window && 'PerformanceObserver' in window) {
                  const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                      if (entry.name === 'first-contentful-paint') {
                        window.fcpValue = entry.startTime;
                      }
                      if (entry.name === 'largest-contentful-paint') {
                        window.lcpValue = entry.startTime;
                      }
                    });
                  });
                  observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
                }
                
                // Modern Design System activation
                window.modernDesignSystemActive = true;
                window.glassCardElements = [];
                window.glowButtonElements = [];
                
                console.log('🚀 Performance monitoring and design system initialized');
              }
            `
          }}
        />
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
