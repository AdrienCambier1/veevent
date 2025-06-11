import { BellNotification, ScanQrCode } from "iconoir-react";
import Link from "next/link";
import "./welcome.scss";
import { useAuth } from "@/contexts/auth-context";

export default function Welcome() {
  const { loading, isAuthenticated, user } = useAuth();

  return (
    <div className={`welcome ${!loading && "welcome-visible"}`}>
      <p className="hello">
        Bonjour {isAuthenticated ? user?.fistName || user?.name : "visiteur"} !
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
