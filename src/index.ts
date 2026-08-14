/**
 * Point d'entrée de l'intégration progressive Agent Canvas.
 *
 * Structure :
 *   - `landing/`    : ancrage de la landing page existante (Next.js App Router).
 *   - `platform/`   : modules de la plateforme (dashboard, chat, agents,
 *                     projects, preview, terminal) — intégration progressive.
 *   - `services/`   : couches d'abstraction (websocket, agent, mcp, skills,
 *                     ai-provider) pont vers le moteur OpenHands.
 *   - `components/` : composants UI partagés de la plateforme.
 *
 * Principes :
 *   - Rien de l'existant n'est supprimé ni remplacé.
 *   - Le moteur OpenHands (runtime, websockets, MCP, skills, événements)
 *     reste intact dans `vendor/OpenHands/`.
 *   - La landing et la plateforme évoluent séparément.
 *
 * Voir `INTEGRATION.md` pour la cartographie détaillée des modules.
 */

export * as platform from "./platform";
export * as services from "./services";
