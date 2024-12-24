import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme_provider";
import type { Metadata } from "next";
import {Sour_Gummy, Truculenta, Urbanist} from "next/font/google";
import constants from "../../constants";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://localhost:3000/"),
  title: {
    default: constants.name,
    template: `%s | ${constants.name}`,
  },
  description: `Navigate Seoul with ease using ${constants.name}, the ultimate smart city web application.`,
  openGraph: {
    title: `${constants.name} - Your Smart City Companion`,
    description: `Navigate Seoul with ease using ${constants.name}, the ultimate smart city web application.`,
    url: "https://localhost:3000/",
    siteName: constants.name,
    images: [
      {
        url: "https://utfs.io/f/8a428f85-ae83-4ca7-9237-6f8b65411293-eun6ii.png",
        width: 1200,
        height: 630,
        alt: `${constants.name} Smart City Web Application`,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${constants.name} - Your Smart City Companion`,
    description:
      `Navigate Seoul with ease using ${constants.name}, the ultimate smart city web application.`,
    creator: "@YourTwitterHandle",
    images: [
      "https://utfs.io/f/8a428f85-ae83-4ca7-9237-6f8b65411293-eun6ii.png",
    ],
  },
};

const sourGummy = Urbanist({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sourGummy.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
