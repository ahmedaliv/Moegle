import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";



export const metadata: Metadata = {
  title: "Moegle",
  description: "Omegle but with more moe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <Navbar />
        <main className="w-[95%]  max-h-screen mx-auto flex flex-col items-center justify-center ">
          {children}
        </main>
      </body>
    </html>
  );
}
