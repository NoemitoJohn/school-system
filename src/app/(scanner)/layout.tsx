import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import SideBar from "@/components/SideBar";
import { Toaster } from 'react-hot-toast';
const poppins = Poppins({weight : '400', subsets: ["latin"]})

export const metadata: Metadata = {
  title: "School System",
  // description: "Generated by create next app",
};

export default function ScannerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${poppins.className} h-full `}>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        {children}    
      </body>
    </html>
  );
}
