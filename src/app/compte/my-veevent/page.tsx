import React, { Suspense } from "react";

function MyVeeventPageContent() {
  return <>
  <div className="wrapper">
    <h1>Mes événements</h1>
  </div>
  </>;
}

export default function MyVeeventPage() {
  return (
    <Suspense fallback={null}>
      <MyVeeventPageContent />
    </Suspense>
  );
}
