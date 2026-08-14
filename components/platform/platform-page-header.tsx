"use client";

import type { ReactNode } from "react";

interface PlatformPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** En-tête de page standard pour la plateforme Agent Canvas. */
export function PlatformPageHeader({ title, description, action }: PlatformPageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-light tracking-tighter">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
