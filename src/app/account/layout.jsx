import Image from "next/image";
import nice4k from "@/assets/images/nice4k.jpg";
import ProfilCard from "@/components/cards/profil-card";

export default function AccountLayout({ children }) {
  return (
    <main>
      <section className="container">
        <h1>Mon profil</h1>
        <div className="relative">
          <Image src={nice4k} alt="City image" className="banner" />
          <ProfilCard
            name="Jean Claude Jean ClaudeJean Claude"
            id="@jeanclaudedu06"
            note={4}
          />
        </div>
      </section>
      {children}
    </main>
  );
}
