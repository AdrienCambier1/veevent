"use client";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";
import { CityProvider } from "@/contexts/city-context";
import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="transparent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>
      <body>
        <AuthProvider>
          <CityProvider>
            <Header />
            {children}
            <Footer />
          </CityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
