import next from "eslint-config-next";

/** Configuration ESLint (format flat, ESLint 9). */
const config = [
  ...next,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      // setState-in-effect est un pattern légitime de synchronisation côté
      // client / chargement de données ; signalé en avertissement plutôt
      // qu'en erreur pour ne pas bloquer le CI sur ces motifs intentionnels.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    ignores: ["vendor/**", "node_modules/**", ".next/**", ".agents_tmp/**"],
  },
];

export default config;
