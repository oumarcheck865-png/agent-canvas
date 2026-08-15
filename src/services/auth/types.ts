/**
 * Auth — contrats de la couche d'authentification Agent Canvas.
 *
 * L'authentification est volontairement découplée de toute implémentation
 * backend. La plateforme est conçue pour fonctionner de façon autonome ;
 * le runtime agent OpenHands (agent-server) ou tout autre backend
 * d'authentification pourra être branché plus tard en implémentant
 * `AuthService`.
 *
 * Aucune connexion cloud obligatoire : l'implémentation locale
 * (`LocalAuthService`) stocke la session côté client.
 */

/** Session utilisateur minimale exposée à l'interface. */
export interface AuthSession {
  /** Identifiant stable (dérivé de l'email en local). */
  id: string;
  /** Nom affichable. */
  name?: string;
  /** Email de l'utilisateur. */
  email: string;
  /** Horodatage de création de la session (ms). */
  createdAt: number;
}

/** Identifiants de connexion / inscription. */
export interface AuthCredentials {
  name?: string;
  email: string;
  password: string;
}

/** Contrat qu'un service d'authentification doit implémenter. */
export interface AuthService {
  /** Récupère la session courante, ou `null` si non authentifié. */
  getSession(): AuthSession | null;
  /** Crée une session (inscription). */
  signUp(credentials: AuthCredentials): Promise<AuthSession>;
  /** Authentifie et crée une session (connexion). */
  signIn(credentials: AuthCredentials): Promise<AuthSession>;
  /** Termine la session courante. */
  signOut(): void;
  /** S'abonne aux changements de session (retourne un désabonnement). */
  subscribe(listener: (session: AuthSession | null) => void): () => void;
}
