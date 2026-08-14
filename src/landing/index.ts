/**
 * Landing Agent Canvas — point d'ancrage de la landing page existante.
 *
 * La landing Next.js actuelle vit dans `app/` et `components/` (à la racine du
 * projet) et n'est PAS déplacée : la déplacer casserait le build App Router.
 * Ce fichier sert uniquement de point de référence logique pour que la landing
 * et la plateforme (`src/platform/`) puissent évoluer séparément.
 *
 * Les exports ci-dessous pointent vers les composants existants via l'alias
 * `@/` (racine du projet), sans dupliquer ni supprimer de code.
 */

export { default as Navbar } from "@/components/navbar";
export { default as Hero } from "@/components/hero";
export { default as Footer } from "@/components/footer";
export { default as Pricing } from "@/components/pricing";
export { default as Testimonials } from "@/components/testimonials";
export { default as Stats } from "@/components/stats";
export { default as Partners } from "@/components/partners";
export { default as Faq } from "@/components/faq";
