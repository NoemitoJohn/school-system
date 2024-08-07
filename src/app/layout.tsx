import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/SideBar";
import { Toaster } from 'react-hot-toast';
const poppins = Poppins({weight : '400', subsets: ["latin"]})

export const metadata: Metadata = {
  title: "School System",
  // description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <div className="flex h-screen">
          <div className="h-full">
            <SideBar />
          </div>
          <Toaster
            position="top-center"
            reverseOrder={false}
           />
          <div className="w-full overflow-auto">
            {children}
          </div>
        </div>
        </body>
    </html>
  );
}
