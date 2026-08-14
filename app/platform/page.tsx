import { redirect } from "next/navigation";

/** Le point d'entrée `/platform` redirige vers le chat principal. */
export default function PlatformIndex() {
  redirect("/platform/chat");
}
