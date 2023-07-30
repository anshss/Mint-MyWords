import "./css/style.css";

import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/ui/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Mint My Words",
  description: "Alexa skill to mint NFT on solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} font-inter antialiased bg-white text-gray-900 tracking-tight`}
        >
          <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
            <Header />
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
