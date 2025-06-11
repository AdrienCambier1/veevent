import "./globals.scss";
import Header from "@/components/header/header";
import { CityProvider } from "@/contexts/city-context";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { ReactNode } from "react";
import FloatingMenu from "@/components/menu/floating-menu/floating-menu";
import { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent" as const,
  },
  themeColor: "#f7f7f7",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  // themeColor: "transparent",
  viewportFit: "cover" as const,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <CityProvider>
            <SidebarProvider>
              <Header hideCitySelector={false} />
              {children}
              <FloatingMenu />
            </SidebarProvider>
          </CityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
