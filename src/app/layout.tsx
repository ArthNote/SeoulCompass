import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme_provider";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import constants from "../../constants";
import { Toaster } from "@/components/ui/sonner";

import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/components/providers/query-provider";
import AuthorizationWrapper from "@/components/wrappers/AuthorizationWrapper";
import { RoleProvider } from "@/hooks/use_role";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
    description: `Navigate Seoul with ease using ${constants.name}, the ultimate smart city web application.`,
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
    <ClerkProvider>
      <QueryProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${sourGummy.className} antialiased`}
            suppressHydrationWarning
          >
            <RoleProvider>
              <AuthorizationWrapper>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  {children}
                  <Toaster />
                  <ReactQueryDevtools />
                </ThemeProvider>
              </AuthorizationWrapper>
            </RoleProvider>
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
