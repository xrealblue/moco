import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";


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
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
