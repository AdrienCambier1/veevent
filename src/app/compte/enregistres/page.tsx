import React, { Suspense } from "react";

function EnregistresPageContent() {
  return <>
  <div className="wrapper">
    <h1>Mes événements</h1>
  </div>
  </>;
}

export default function EnregistresPage() {
  return (
    <Suspense fallback={null}>
      <EnregistresPageContent />
    </Suspense>
  );
}
