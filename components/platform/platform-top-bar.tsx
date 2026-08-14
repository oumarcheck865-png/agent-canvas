"use client";

import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { label: "Espace de travail", href: "/platform/workspace" },
  { label: "Conversations", href: "/platform/conversations" },
  { label: "Projets", href: "/platform/projects" },
  { label: "Agents", href: "/platform/agents" },
  { label: "Preview", href: "/platform/preview" },
  { label: "Terminal", href: "/platform/terminal" },
] as const;

/** Barre supérieure mobile de la plateforme (menu déroulant). */
export function PlatformTopBar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card/40 px-4 md:hidden">
      <Link href="/platform/workspace" className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Sparkles className="size-4" />
        </span>
        <span className="font-light tracking-tighter">Agent Canvas</span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Menu de navigation">
            <Menu className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {NAV_ITEMS.map(({ label, href }) => (
            <DropdownMenuItem key={href} asChild>
              <Link href={href}>{label}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild>
            <Link href="/">← Retour à la landing</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
