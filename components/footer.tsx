"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { motion } from "framer-motion";
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";

const Footer = () => {
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://github.com/All-Hands-AI/OpenHands",
      icon: TwitterLogoIcon,
    },
    {
      name: "GitHub",
      href: "https://github.com/All-Hands-AI/OpenHands",
      icon: GitHubLogoIcon,
    },
  ];

  const footerLinks = [
    { name: "Tarifs", href: "#pricing" },
    { name: "Témoignages", href: "#testimonials" },
    { name: "Démarrer", href: "/signup" },
  ];

  return (
    <footer className="w-full border-t bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-block text-xl font-medium tracking-tight transition-opacity hover:opacity-80"
              >
                Agent Canvas
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Concevez et déployez des agents IA autonomes, propulsés par
                OpenHands, sur une plateforme pensée pour la production.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Liens rapides</h3>
              <div className="flex flex-col gap-2">
                {footerLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Réseaux</h3>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                  >
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                    >
                      <social.icon className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col items-center justify-between gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
            <span>© {year} Agent Canvas. Tous droits réservés.</span>
            <span className="font-medium">Propulsé par OpenHands</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
