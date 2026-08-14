/**
 * Services Agent Canvas — point d'agrégation des couches d'abstraction.
 *
 * Chaque service (websocket, agent, mcp, skills, ai-provider) est une barrière
 * d'intégration vers l'implémentation OpenHands correspondante. Aucune
 * implémentation n'est branchée pour le moment : on expose uniquement les
 * contrats (types/interfaces) et des factories renvoyant `null`.
 *
 * Le moteur OpenHands reste intact et n'est pas réécrit.
 */

export * as websocket from "./websocket";
export * as agent from "./agent";
export * as mcp from "./mcp";
export * as skills from "./skills";
export * as aiProvider from "./ai-provider";
export * as auth from "./auth";
export * as config from "./config";
