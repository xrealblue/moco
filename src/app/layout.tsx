import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import Header from "@/components/Header";


export const metadata: Metadata = {
  title: "Moco - Trading NewsPaper",
  description: "Get trading new with finsight apis and tradingView widgets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-black super antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
