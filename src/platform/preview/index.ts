/**
 * Module d'intégration — Preview (navigateur intégré).
 *
 * Point d'extension qui accueillera progressivement la preview navigateur
 * OpenHands (`vendor/OpenHands/src/components/features/browser/`).
 *
 * Cette phase : préparation du point de montage uniquement.
 */

export interface PreviewModuleInfo {
  readonly id: "preview";
  enabled: boolean;
}

export const previewModule: PreviewModuleInfo = {
  id: "preview",
  enabled: false,
};
