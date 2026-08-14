import { redirect } from "next/navigation";

/** Le point d'entrée `/platform` redirige vers l'espace de travail. */
export default function PlatformIndex() {
  redirect("/platform/workspace");
}
