import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./interactions.css";
import "./chat.css";
import "./overlays.css";
import "./themes.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shuf — Play, match and talk",
  description:
    "A polished interactive entertainment experience with social games, matchmaking, audience reactions and modern local-first messaging.",
  applicationName: "Shuf",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Shuf",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
