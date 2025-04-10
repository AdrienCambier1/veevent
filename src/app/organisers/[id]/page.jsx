"use client";
import { useParams } from "next/navigation";

export default function OrganiserPage() {
  const { id } = useParams();
  return <h1>{id}</h1>;
}
