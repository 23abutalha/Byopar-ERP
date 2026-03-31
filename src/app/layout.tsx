import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Byopar ERP | AI Intelligence",
  description: "Next-Generation Retail Management",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/2622/2622713.png"></link>
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>      
      </head>
      <body style={{ margin: 0, background: '#0f172a' }}>{children}</body>
    </html>
  );
}