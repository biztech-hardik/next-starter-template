import type { Metadata } from "next";
import { GoogleTagManager } from '@next/third-parties/google'
import "./globals.css";
import { getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Macroscopic Ventures",
  description: "Improving the lives of future generations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();
  const { googleTagManagerId, googleTagManagerEnabled } = siteSettings || {};
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="profile" href="https://gmpg.org/xfn/11" />
        <link rel="icon" href="/favicon.png" />
      </head>
      {googleTagManagerEnabled && googleTagManagerId && <GoogleTagManager gtmId={googleTagManagerId} />}
      <body className="__variable_5cfdac __variable_9a8899 splash-show">
        {children}
      </body>
    </html>
  );
}
