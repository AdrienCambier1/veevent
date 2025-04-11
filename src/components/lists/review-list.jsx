import CustomTitle from "@/components/titles/custom-title";
import ReviewCard from "@/components/cards/review-card";

export default function ReviewList({ title, description, showText, showForm }) {
  return (
    <section className="page-grid">
      <div className="flex flex-col gap-6">
        <CustomTitle title={title} description={description} />
        <div className="flex flex-col gap-4">
          {showText && (
            <p>
              Un avis inapproprié ? Signalez-le et notre modération s'en
              chargera.
            </p>
          )}
          {showForm && <input type="text" placeholder="Mot clé" />}
        </div>
      </div>
      <div className="cards-grid !grid-cols-1 ">
        <ReviewCard
          name="Jean claude"
          note={4}
          date="vendredi 13 juin 2024"
          review="J’ai bien aimé c’était cool, surtout quand il a commencé à faire de la gymnastique."
          event="Atelier fresque végétal"
        />
        <ReviewCard
          name="Jean claude"
          note={4}
          date="vendredi 13 juin 2024"
          review="J’ai bien aimé c’était cool, surtout quand il a commencé à faire de la gymnastique."
          event="Atelier fresque végétal"
        />
        <ReviewCard
          name="Jean claude"
          note={4}
          date="vendredi 13 juin 2024"
          review="J’ai bien aimé c’était cool, surtout quand il a commencé à faire de la gymnastique."
          event="Atelier fresque végétal"
        />
        <ReviewCard
          name="Jean claude"
          note={4}
          date="vendredi 13 juin 2024"
          review="J’ai bien aimé c’était cool, surtout quand il a commencé à faire de la gymnastique."
          event="Atelier fresque végétal"
        />
      </div>
    </section>
  );
}
