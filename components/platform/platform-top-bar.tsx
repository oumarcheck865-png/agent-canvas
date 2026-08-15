"use client";

import Link from "next/link";
import { Menu, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-provider";

const NAV_ITEMS = [
  { label: "Chat", href: "/platform/chat" },
  { label: "Espace de travail", href: "/platform/workspace" },
  { label: "Conversations", href: "/platform/conversations" },
  { label: "Projets", href: "/platform/projects" },
  { label: "Agents", href: "/platform/agents" },
  { label: "Preview", href: "/platform/preview" },
  { label: "Terminal", href: "/platform/terminal" },
] as const;

/** Barre supérieure mobile de la plateforme (menu déroulant). */
export function PlatformTopBar() {
  const { signOut } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card/40 px-4 md:hidden">
      <Link href="/platform/chat" className="flex items-center gap-2">
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
          <DropdownMenuItem onSelect={() => signOut()}>
            <LogOut className="mr-2 size-4" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
