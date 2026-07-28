import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/AppContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plateful — Premium Restaurant Discovery & Management Console",
  description: "A city-aware food discovery app and unified restaurant management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-bg text-ink font-sans selection:bg-primary-soft selection:text-primary"
        suppressHydrationWarning
      >
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

