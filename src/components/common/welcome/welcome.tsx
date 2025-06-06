import { BellNotification, ScanQrCode } from "iconoir-react";
import Link from "next/link";
import "./welcome.scss";

interface WelcomeProps {
  user?: {
    name: string;
  };
}

export default function Welcome({ user }: WelcomeProps) {
  return (
    <div className="welcome">
      <div className="hello">Bonjour {user && user.name} !</div>
      {!user && (
        <div className="welcome-links">
          <Link href="/connexion">
            <span>Connectez-vous</span>
          </Link>
          ou
          <Link href="/inscription">
            <span>Inscrivez-vous</span>
          </Link>
        </div>
      )}
      {user && (
        <div className="user-actions">
          <Link href="/profile">
            <BellNotification /> Notifications
          </Link>
          <Link href="/profile">
            <ScanQrCode /> Mes Billets
          </Link>
        </div>
      )}
    </div>
  );
}
