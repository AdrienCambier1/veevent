import React, { Suspense } from "react";

function TicketsPageContent() {
  return <>
  <div className="wrapper">
    <h1>Mes événements</h1>
  </div>
  </>;
}

export default function TicketsPage() {
  return (
    <Suspense fallback={null}>
      <TicketsPageContent />
    </Suspense>
  );
}
