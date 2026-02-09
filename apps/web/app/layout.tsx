import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PAGE_TITLES } from "@/lib/page-titles";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://json-render.dev"),
  title: {
    default: `json-render | ${PAGE_TITLES[""]}`,
    template: "%s | json-render",
  },
  description:
    "The framework for User-Generated Interfaces (UGI). Let users generate dashboards, widgets, and apps from prompts — safely constrained to components you define.",
  keywords: [
    "json-render",
    "UGI",
    "User-Generated Interfaces",
    "AI UI generation",
    "generative UI",
    "React components",
    "React Native",
    "guardrails",
    "structured output",
    "dashboard builder",
  ],
  authors: [{ name: "Vercel Labs" }],
  creator: "Vercel Labs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://json-render.dev",
    siteName: "json-render",
    title: "json-render | The framework for User-Generated Interfaces",
    description:
      "The framework for User-Generated Interfaces (UGI). Let users generate dashboards, widgets, and apps from prompts — safely constrained to components you define.",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "json-render - The framework for User-Generated Interfaces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "json-render | The framework for User-Generated Interfaces",
    description:
      "The framework for User-Generated Interfaces (UGI). Let users generate dashboards, widgets, and apps from prompts — safely constrained to components you define.",
    images: ["/og"],
    creator: "@verabornnot",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
