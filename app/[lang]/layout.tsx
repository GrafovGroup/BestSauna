import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  applicationName: "BestSauna.ca",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "16x16 32x32 48x48" }, { url: "/icons/favicon-32.png", type: "image/png", sizes: "32x32" }, { url: "/icons/favicon-16.png", type: "image/png", sizes: "16x16" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <html lang={lang === "fr" ? "fr-CA" : "en-CA"}><body>{children}</body></html>;
}
