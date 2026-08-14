# Couche d'intégration OpenHands — backend/

La couche `backend/` contient des adaptateurs **framework-agnostiques**
(`fetch` + `WebSocket` natif) qui réutilisent le **contrat officiel** de
l'agent-server OpenHands, sans dépendre du paquet `@openhands/typescript-client`
(incompatible avec Next.js : HeroUI / React Router).

## Principes

- **Le moteur agent OpenHands n'est pas réécrit.** On appelle simplement le
  runtime officiel via son API HTTP/WebSocket.
- **Aucune valeur cloud OpenHands/OpenAI codée.** Toute la configuration
  provient de `runtimeConfig` (`NEXT_PUBLIC_AGENT_SERVER_*`).
- **Aucun appel réseau superflu** tant que l'agent-server n'est pas configuré.
- **Réutilisation maximale du code officiel** : les routes, en-têtes et
  handshake sont calqués sur `vendor/OpenHands/src/`.

## Modules

### `agent-server-client.ts`
Client HTTP de base. En-tête `X-Session-API-Key`, gestion du timeout,
erreures normalisées (`NoAgentServerConfiguredError`, `AgentServerError`).
- `agentServerRequest<T>(options)` — requête générique typée.
- `isAgentServerConfigured()` — indique si un runtime est configuré.

### `agent-server-socket.ts`
Client WebSocket (`AgentSocket`).
- URL : `ws[s]://<host>[/path]/sockets/events/<conversationId>`
  (cf. `vendor/OpenHands/src/utils/websocket-url.ts` → `buildWebSocketUrl`).
- Handshake : premier message `{ type: "auth", session_api_key }`
  (cf. `vendor/OpenHands/src/utils/websocket-auth.ts` → `sendWebSocketAuth`).
- `connect/disconnect/send/onEvent/onStatus`.

### `conversations-api.ts`
Adaptateur Conversations réutilisant les routes officielles :
- `GET /api/conversations/search`
- `GET /api/conversations/{id}`
- `POST /api/conversations`
- `DELETE /api/conversations/{id}`
- `GET /api/v1/conversation/{id}/events/search`
- `POST /api/conversations/{id}/events` (envoi message)

### `index.ts`
Barrel d'exports.

## Branchement des services (`src/services/`)

Les services abstraits sont désormais branchés sur cette couche :

| Service            | Backend utilisé                         | Statut |
| ------------------ | --------------------------------------- | ------ |
| `services/websocket` | `AgentSocket` (handshake officiel)    | branché |
| `services/agent`     | `conversationsApi` (routes officielles) | branché (list/send) |
| `services/mcp`       | —                                       | contrat prêt (branchement à venir) |
| `services/skills`    | —                                       | contrat prêt (branchement à venir) |

## Configuration

```
NEXT_PUBLIC_AGENT_SERVER_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_AGENT_SERVER_SESSION_API_KEY=...   # .env.local uniquement
NEXT_PUBLIC_AGENT_WORKING_DIR=/workspace/project/agent-canvas
```

Tant que `NEXT_PUBLIC_AGENT_SERVER_BASE_URL` est vide, aucune requête n'est
émise ; les factories renvoient `null` ou lèvent `NoAgentServerConfiguredError`.

## Règles respectées

- Aucune fonctionnalité agent supprimée ou réécrite.
- Aucune dépendance externe ajoutée (fetch + WebSocket natif).
- Aucune valeur cloud codée.
- Aucun fichier existant supprimé.
