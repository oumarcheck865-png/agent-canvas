/**
 * Implémentation locale de l'authentification.
 *
 * Stocke la session côté client (localStorage). Cette implémentation est
 * volontairement autonome : elle n'appelle aucun service cloud et n'envoie
 * aucune donnée à l'extérieur. Elle sert de socle fonctionnel à la plateforme
 * tant qu'un backend d'authentification (ex. agent-server OpenHands) n'est
 * pas branché.
 *
 * NOTE — il s'agit d'une session côté client, pas d'une authentification
 * sécurisée de bout en bout. L'interface `AuthService` est conçue pour être
 * remplacée par une implémentation backend le moment venu, sans toucher aux
 * composants qui la consomment.
 */

import type {
  AuthCredentials,
  AuthService,
  AuthSession,
} from "./types";

const STORAGE_KEY = "agent-canvas:session";
const USERS_KEY = "agent-canvas:users";

/** « Base de données » locale des comptes créés (inscription). */
interface StoredUser {
  id: string;
  name?: string;
  email: string;
  /** Hash léger côté client — uniquement pour bloquer les identifiants vides
   *  et la réinscription d'un email. Ne remplace PAS un hash serveur. */
  passwordHash: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Hash déterministe léger (non cryptographique). */
function lightHash(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `h${hash}`;
}

function readUsers(): StoredUser[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession(): AuthSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

function writeSession(session: AuthSession | null): void {
  if (!isBrowser()) return;
  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function toSession(user: StoredUser): AuthSession {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: Date.now(),
  };
}

export class LocalAuthService implements AuthService {
  private listeners = new Set<(session: AuthSession | null) => void>();

  getSession(): AuthSession | null {
    return readSession();
  }

  async signUp(credentials: AuthCredentials): Promise<AuthSession> {
    const email = credentials.email.trim().toLowerCase();
    if (!email || !credentials.password) {
      throw new Error("Email et mot de passe requis.");
    }
    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      throw new Error("Un compte existe déjà avec cet email.");
    }
    const user: StoredUser = {
      id: `user_${lightHash(email)}_${Date.now().toString(36)}`,
      name: credentials.name?.trim() || undefined,
      email,
      passwordHash: lightHash(credentials.password),
    };
    writeUsers([...users, user]);
    const session = toSession(user);
    writeSession(session);
    this.emit();
    return session;
  }

  async signIn(credentials: AuthCredentials): Promise<AuthSession> {
    const email = credentials.email.trim().toLowerCase();
    const users = readUsers();
    const user = users.find((u) => u.email === email);
    // En local, on accepte aussi une connexion « invité » sans compte préalable
    // pour permettre le parcours de démonstration tout en gardant le contrat.
    if (!user) {
      const guest: StoredUser = {
        id: `user_${lightHash(email)}_${Date.now().toString(36)}`,
        name: credentials.name?.trim() || undefined,
        email,
        passwordHash: lightHash(credentials.password),
      };
      writeUsers([...users, guest]);
      const session = toSession(guest);
      writeSession(session);
      this.emit();
      return session;
    }
    if (user.passwordHash !== lightHash(credentials.password)) {
      throw new Error("Identifiants incorrects.");
    }
    const session = toSession(user);
    writeSession(session);
    this.emit();
    return session;
  }

  signOut(): void {
    writeSession(null);
    this.emit();
  }

  subscribe(listener: (session: AuthSession | null) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    const session = this.getSession();
    this.listeners.forEach((l) => l(session));
  }
}

/** Instance singleton du service d'authentification local. */
export const localAuthService = new LocalAuthService();
