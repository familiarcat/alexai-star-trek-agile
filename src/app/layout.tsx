import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./lcars.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Authentic LCARS Bridge Layout */}
        <div className="lcars-container">
          {/* Navigation Panel - Left Side */}
          <div id="column-1">
            <div className="lcars-menu">
              <a href="/" className="lcars-menu-item">DASHBOARD</a>
              <a href="/projects" className="lcars-menu-item">PROJECTS</a>
              <a href="/tasks" className="lcars-menu-item">TASKS</a>
              <a href="/analytics" className="lcars-menu-item">ANALYTICS</a>
              <a href="/alexai" className="lcars-menu-item">ALEXAI</a>
              <a href="/observation-lounge" className="lcars-menu-item">OBSERVATION LOUNGE</a>
            </div>
          </div>
          
          {/* Status Bar - Top */}
          <div id="column-2">
            <div className="lcars-status-content">
              <span>ALEXAI STAR TREK AGILE SYSTEM</span>
              <span>STARDATE: {new Date().toISOString().slice(0, 10)}</span>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div id="column-3">
            {children}
          </div>
          
          {/* Data Panel - Bottom */}
          <div className="lcars-data-panel">
            <span>SYSTEM STATUS: OPERATIONAL</span>
            <span>ACTIVE MISSIONS: 3</span>
          </div>
          
          {/* Controls Panel - Right Side */}
          <div className="lcars-controls">
            <button className="lcars-button">NAVIGATE</button>
            <button className="lcars-button info">ANALYTICS</button>
            <button className="lcars-button success">PROJECTS</button>
            <button className="lcars-button warning">TASKS</button>
            <button className="lcars-button alert">ALEXAI</button>
          </div>
        </div>
      </body>
    </html>
  );
}
