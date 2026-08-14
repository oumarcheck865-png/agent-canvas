/**
 * Module d'intégration — Terminal.
 *
 * Point d'extension qui accueillera progressivement le terminal intégré
 * OpenHands (`vendor/OpenHands/src/components/features/terminal/` basé sur
 * @xterm/xterm, et la WebSocket bash-events).
 *
 * Cette phase : préparation du point de montage uniquement.
 */

export interface TerminalModuleInfo {
  readonly id: "terminal";
  enabled: boolean;
}

export const terminalModule: TerminalModuleInfo = {
  id: "terminal",
  enabled: false,
};
