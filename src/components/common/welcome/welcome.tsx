import { BellNotification, ScanQrCode } from "iconoir-react";
import Link from "next/link";
import "./welcome.scss";
import { useAuth } from "@/contexts/auth-context";
import WelcomeSkeleton from "./welcome-skeleton";

export default function Welcome() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <WelcomeSkeleton />;
  }

  return (
    <div className="welcome">
      <p className="hello">
        Bonjour {isAuthenticated ? user?.firstName || user?.lastName : ""} !
      </p>

      {!isAuthenticated ? (
        <p className="welcome-links">
          <Link href="/connexion">
            <span>Connectez-vous</span>
          </Link>{" "}
          ou{" "}
          <Link href="/inscription">
            <span>Inscrivez-vous</span>
          </Link>
        </p>
      ) : (
        <div className="user-buttons">
          <Link href="/compte/notifications" className="user-btn flex-1">
            <BellNotification /> Notifications
          </Link>
          <Link href="/compte/tickets" className="user-btn flex-1">
            <ScanQrCode /> Mes Billets
          </Link>
        </div>
      )}
    </div>
  );
}
