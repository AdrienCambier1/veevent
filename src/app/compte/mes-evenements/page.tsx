import React, { Suspense } from "react";

function MesEvenementsPageContent() {
  return <>
  <div className="wrapper">
    <h1>Mes événements</h1>
  </div>
  </>;
}

export default function MesEvenementsPage() {
  return (
    <Suspense fallback={null}>
      <MesEvenementsPageContent />
    </Suspense>
  );
}
