/**
 * Configuration runtime d'Agent Canvas.
 *
 * Source unique de vérité pour la configuration indépendante du cloud.
 * Lit les variables d'environnement Next.js (NEXT_PUBLIC_* côté navigateur,
 * variables serveur pour les secrets).
 *
 * Principes :
 *   - Aucune valeur cloud OpenHands/OpenAI par défaut.
 *   - Aucune clé secrète codée en dur.
 *   - Télémétrie désactivée par défaut.
 *   - Le runtime agent et le fournisseur IA sont configurés manuellement.
 */

/** État de la télémétrie (désactivée par défaut). */
export interface TelemetryConfig {
  /** True si toute télémétrie est désactivée. */
  disabled: boolean;
}

/** Configuration du runtime agent (agent-server). */
export interface AgentRuntimeConfig {
  /** URL de base de l'agent-server (vide = configuration manuelle). */
  baseUrl: string;
  /** Clé de session API (vide = non configurée côté client). */
  sessionApiKey: string;
  /** Répertoire de travail de base pour les conversations. */
  workingDir: string;
}

/** Configuration du fournisseur IA (AI Provider Layer). */
export interface AIProviderEnvConfig {
  /** Famille de fournisseur. */
  kind: string;
  /** Point d'accès du fournisseur. */
  baseUrl: string;
  /** Identifiant du modèle. */
  model: string;
  /** Clé API (jamais codée ; vide par défaut). */
  apiKey: string;
}

/** Configuration d'authentification. */
export interface AuthConfig {
  /** Authentification requise pour accéder à la plateforme. */
  required: boolean;
}

/** Configuration applicative. */
export interface AppConfig {
  /** Nom de l'application affiché dans l'interface. */
  name: string;
}

/** Configuration complète d'Agent Canvas. */
export interface RuntimeConfiguration {
  telemetry: TelemetryConfig;
  agentRuntime: AgentRuntimeConfig;
  aiProvider: AIProviderEnvConfig;
  auth: AuthConfig;
  app: AppConfig;
}

/** Lit une variable d'environnement publique (côté navigateur). */
function publicEnv(key: string, fallback = ""): string {
  if (typeof process !== "undefined" && process.env) {
    const value = process.env[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return fallback;
}

function isTruthy(value: string): boolean {
  return value === "true" || value === "1";
}

/** Configuration résolue à partir de l'environnement. */
export const runtimeConfig: RuntimeConfiguration = {
  telemetry: {
    // Désactivée par défaut pour garantir l'indépendance du cloud.
    disabled: isTruthy(publicEnv("NEXT_PUBLIC_TELEMETRY_DISABLED", "true")),
  },
  agentRuntime: {
    baseUrl: publicEnv("NEXT_PUBLIC_AGENT_SERVER_BASE_URL"),
    sessionApiKey: publicEnv("NEXT_PUBLIC_AGENT_SERVER_SESSION_API_KEY"),
    workingDir: publicEnv(
      "NEXT_PUBLIC_AGENT_WORKING_DIR",
      "/workspace/project/agent-canvas",
    ),
  },
  aiProvider: {
    kind: publicEnv("NEXT_PUBLIC_AI_PROVIDER_KIND"),
    baseUrl: publicEnv("NEXT_PUBLIC_AI_PROVIDER_BASE_URL"),
    model: publicEnv("NEXT_PUBLIC_AI_PROVIDER_MODEL"),
    apiKey: publicEnv("NEXT_PUBLIC_AI_PROVIDER_API_KEY"),
  },
  auth: {
    required: isTruthy(publicEnv("NEXT_PUBLIC_AUTH_REQUIRED", "false")),
  },
  app: {
    name: publicEnv("NEXT_PUBLIC_APP_NAME", "Agent Canvas"),
  },
};
