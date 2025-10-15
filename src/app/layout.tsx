import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // 1. Import Toaster
import { Navbar } from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aakar",
  description: "Your unified skill portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
         <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Toaster // 2. Add the component here
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#334155', // bg-slate-700
              color: '#f8fafc', // text-slate-50
            },
          }}
        />
      </body>
    </html>
  );
}