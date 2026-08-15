/**
 * Barrel export de la couche d'authentification.
 *
 * Le service par défaut est l'implémentation locale autonome. Pour brancher
 * un backend d'authentification (ex. agent-server OpenHands), il suffit de
 * remplacer `authService` par une autre implémentation de `AuthService`.
 */

export type {
  AuthCredentials,
  AuthService,
  AuthSession,
} from "./types";

export { LocalAuthService, localAuthService } from "./local-auth";

import { localAuthService } from "./local-auth";

/**
 * Service d'authentification actif.
 * Par défaut : implémentation locale (aucune dépendance cloud).
 */
export const authService = localAuthService;
