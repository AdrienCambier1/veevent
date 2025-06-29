import "./globals.scss";
import Header from "@/components/header/header";
import { CityProvider } from "@/contexts/city-context";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { ReactNode } from "react";
import FloatingMenu from "@/components/menu/floating-menu/floating-menu";
import { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth-context";
import { HeaderProvider } from "@/contexts/header-context";
import { FilterProvider } from "@/contexts/filter-context";

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
  sheet?: React.ReactNode;
}

export default function RootLayout({ children, sheet }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <FilterProvider>
            <HeaderProvider>
              <CityProvider>
                <SidebarProvider>
                  <Header />
                  {children}
                  {sheet}
                  <FloatingMenu />
                </SidebarProvider>
              </CityProvider>
            </HeaderProvider>
          </FilterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
