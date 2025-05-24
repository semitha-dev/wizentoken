import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WizenToken",
  description:
    "WizenToken is a decentralized token for the Wizen ecosystem. Earn By Trading, Participating in discord event and Playing Games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Header with Logo */}
        <header className="flex items-center p-4 shadow-md bg-white">
          <img
            src="/logo.png"
            alt="WizenToken Logo"
            className="h-10 w-auto mr-4"
          />
          <h1 className="text-xl font-bold">WizenToken</h1>
        </header>

        {/* Main content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
