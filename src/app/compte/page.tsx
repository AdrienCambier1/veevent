import React, { Suspense } from "react";
import { redirect } from "next/navigation";

function ComptePageContent() {
  redirect("/compte/tickets");
  return null;
}

export default function ComptePage() {
  return (
    <Suspense fallback={null}>
      <ComptePageContent />
    </Suspense>
  );
}
