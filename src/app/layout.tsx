import type { Metadata } from "next";
import { Geist, Geist_Mono, Anton, Great_Vibes, Oswald, Poppins } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/components/CartContext";
import CartSidebar from "@/components/CartSidebar";
import fs from 'fs/promises';
import path from 'path';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-signature",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

async function getSeoSettings() {
  try {
    const seoSettingsFile = path.join(process.cwd(), 'data', 'seo-settings.json');
    const data = await fs.readFile(seoSettingsFile, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return {
      title: "Queen Bean",
      description: "A royal culinary experience.",
      keywords: "",
      ogImage: "",
      jsonLd: ""
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    icons: {
      icon: "/images/favicon.svg",
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : [],
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seo = await getSeoSettings();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${greatVibes.variable} ${oswald.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {seo.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: seo.jsonLd }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CartProvider>
          <CartSidebar />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
