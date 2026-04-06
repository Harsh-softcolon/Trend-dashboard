import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const newsreader = Newsreader({ 
  subsets: ["latin"], 
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
  variable: "--font-newsreader"
});

export const metadata: Metadata = {
  title: "DevPulse | Developer Intelligence Portal",
  description: "Aggregated, editorial-grade developer trends from Reddit, HN, and beyond.",
};

const materialSymbols = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
       <head>
          <link rel="stylesheet" href={materialSymbols} />
       </head>
      <body className={`bg-background text-foreground min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
