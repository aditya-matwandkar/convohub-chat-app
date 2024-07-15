import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

// Import Open Sans font
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";

import ModalProvider from "@/components/providers/modal-provider";
import QueryProvider from "@/components/providers/query-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { Toaster } from "@/components/ui/toaster";

import { cn } from "@/lib/utils";
import "./globals.css";

// Configure font object
const openSans = Open_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConvoHub",
  description:
    "Elevate your conversations with ConvoHub, the ultimate platform for seamless communication and collaboration. Connect with friends, family, and colleagues through intuitive chat rooms, voice channels, and video calls. Experience a vibrant community space where ideas flow freely and connections are made effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(openSans.className, "bg-white dark:bg-[#2B2F38]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            storageKey="convohub-theme"
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
