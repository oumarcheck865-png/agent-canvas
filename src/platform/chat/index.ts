/**
 * Module d'intégration — Chat agent.
 *
 * Point d'extension qui accueillera progressivement le chat agent OpenHands
 * (`vendor/OpenHands/src/components/features/chat/`,
 * `components/features/conversation/`, `hooks/chat/`).
 *
 * Cette phase : préparation du point de montage uniquement. Le branchement
 * se fera progressivement après validation, en adaptant au style Agent Canvas
 * (design premium sombre, Tailwind, shadcn/ui).
 */

export interface ChatModuleInfo {
  readonly id: "chat";
  enabled: boolean;
}

export const chatModule: ChatModuleInfo = {
  id: "chat",
  enabled: false,
};
