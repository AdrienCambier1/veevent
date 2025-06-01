import "./globals.css";
import Header from "@/components/header";
import { AuthProvider } from "@/contexts/auth-context";
import { CityProvider } from "@/contexts/city-context";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ReactNode } from "react";

export const metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent" as const,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "transparent",
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
          <SidebarProvider>
            <CityProvider>
              <Header hideCitySelector={false} />
              {children}
            </CityProvider>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
