import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Moegle",
  description: "Omegle but with more moe",
  keywords: ["moegle", "omegle", "moe"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://moegle.vercel.app",
    siteName: "Moegle",
    title: "Moegle",
    description: "Omegle but with more moe",
    images: [
      {
        url: "/logo.png",
        width: 400,
        height: 300,
        alt: "Moegle",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="w-[95%] max-h-screen mx-auto flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
