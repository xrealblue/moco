import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";


export const metadata: Metadata = {
  title: "Moco - Trading NewsPaper",
  description: "Get trading new with inngest apis and tradingView widgets.",
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
        {children}
      </body>
    </html>
  );
}
