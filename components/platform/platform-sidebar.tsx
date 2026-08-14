"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FolderGit2,
  Bot,
  MonitorPlay,
  TerminalSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Barre latérale de la plateforme Agent Canvas.
 * Design premium sombre, shadcn/Tailwind (pas HeroUI). Conserve l'identité
 * visuelle Agent Canvas. Les modules correspondent aux points de montage
 * `src/platform/` (intégration progressive OpenHands).
 */
const NAV_ITEMS = [
  { label: "Espace de travail", href: "/platform/workspace", icon: LayoutDashboard },
  { label: "Conversations", href: "/platform/conversations", icon: MessageSquare },
  { label: "Projets", href: "/platform/projects", icon: FolderGit2 },
  { label: "Agents", href: "/platform/agents", icon: Bot },
  { label: "Preview", href: "/platform/preview", icon: MonitorPlay },
  { label: "Terminal", href: "/platform/terminal", icon: TerminalSquare },
] as const;

export function PlatformSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card/40 md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Sparkles className="size-4" />
        </span>
        <span className="font-light tracking-tighter text-lg">Agent Canvas</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-card hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-4 transition-colors",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center justify-center rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        >
          ← Retour à la landing
        </Link>
      </div>
    </aside>
  );
}
