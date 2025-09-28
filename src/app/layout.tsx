import type { Metadata } from "next";
import { Inder } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {ClerkProvider} from "@clerk/nextjs";

const inder = Inder({subsets:["latin"], weight: "400" })// 通常需要指定字体粗细

export const metadata: Metadata = {
  title: "Social Media App",
  description: "A social media app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
    <html lang="en">
    <body className={inder.className}>
    <div className="w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <Navbar/>
    </div>
    <div className="bg-slate-100 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      {children}
    </div>
    </body>
    </html>
      </ClerkProvider>
);
}
