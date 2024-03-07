import Navbar from "@/components/Navbar";
import { inter } from "./layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="w-[95%]  mx-auto flex flex-col items-center justify-center ">
          {children}
        </main>
      </body>
    </html>
  );
}
