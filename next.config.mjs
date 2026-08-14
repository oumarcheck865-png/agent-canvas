/** @type {import('next').NextConfig} */
const nextConfig = {
  // Agent Canvas est indépendant du cloud : la télémétrie anonyme Next.js est
  // désactivée par défaut. Elle peut être réactivée explicitement via
  // NEXT_TELEMETRY_DEBUG=1 si nécessaire.
  // (La désactivation s'effectue aussi via `next telemetry disable`.)
};

export default nextConfig;
