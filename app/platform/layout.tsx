import type { ReactNode } from "react";
import { PlatformSidebar } from "@/components/platform/platform-sidebar";
import { PlatformTopBar } from "@/components/platform/platform-top-bar";

/**
 * Layout de la plateforme Agent Canvas (route /platform/*).
 *
 * Coexistence avec la landing (`app/page.tsx`) et l'auth (`/login`, `/signup`)
 * qui restent intactes. La plateforme évolue séparément, en conservant
 * l'identité visuelle Agent Canvas (design premium sombre, shadcn/Tailwind).
 *
 * Les modules (workspace, conversations, projets, agents, preview, terminal)
 * sont intégrés progressivement et correspondent aux points de montage
 * `src/platform/` et aux services `src/services/` (intégration OpenHands).
 */
export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <PlatformSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PlatformTopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
