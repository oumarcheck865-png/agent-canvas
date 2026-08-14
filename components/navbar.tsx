"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeSwitcher from "@/components/theme-switcher";
import {
  ChevronDownIcon,
  FaceIcon,
  GlobeIcon,
  OpenInNewWindowIcon,
  PersonIcon,
  TimerIcon,
  HamburgerMenuIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuItems = [
    { name: "Fonctionnalités", href: "#features" },
    { name: "Tarifs", href: "#pricing" },
    { name: "Témoignages", href: "#testimonials" },
  ];

  const showNavbarBlur = isScrolled || isMenuOpen;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-[background-color,backdrop-filter] duration-300 ease-out ${
        showNavbarBlur
          ? "backdrop-blur supports-backdrop-filter:bg-background/60"
          : "backdrop-blur-0 supports-backdrop-filter:bg-background/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isMenuOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
              </motion.div>
            </Button>
          </div>
          <div className="flex sm:hidden">
            <Link href="/" className="font-light tracking-tighter text-lg">
              Agent Canvas
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-8">
            <Link href="/" className="font-light tracking-tighter text-2xl">
              Agent Canvas
            </Link>

            <Button asChild variant="ghost" size="sm">
              <Link href="#features">Fonctionnalités</Link>
            </Button>

            <Button asChild variant="ghost" size="sm">
              <Link href="#pricing">Tarifs</Link>
            </Button>

            <Button asChild variant="ghost" size="sm">
              <Link href="#testimonials">Témoignages</Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Plateforme
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <DropdownMenuItem>
                  <OpenInNewWindowIcon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-semibold">Agents autonomes</div>
                    <div className="text-sm text-muted-foreground">
                      Des agents IA propulsés par OpenHands qui exécutent des
                      tâches complexes de bout en bout.
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PersonIcon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-semibold">Observabilité</div>
                    <div className="text-sm text-muted-foreground">
                      Métriques et journaux en temps réel pour suivre chaque
                      action de vos agents.
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <GlobeIcon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-semibold">Prêt pour la production</div>
                    <div className="text-sm text-muted-foreground">
                      Agent Canvas tourne sur Agent Canvas, rejoignez les
                      équipes qui automatisent à grande échelle.
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TimerIcon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-semibold">+99% de disponibilité</div>
                    <div className="text-sm text-muted-foreground">
                      Une infrastructure hautement disponible pour vos workflows
                      d'automatisation.
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FaceIcon className="mr-2 h-4 w-4" />
                  <div>
                    <div className="font-semibold">Support premium</div>
                    <div className="text-sm text-muted-foreground">
                      Une équipe prête à répondre pour surmonter tous les
                      défis de mise en production.
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:flex">
              <Link href="/signup">Inscription</Link>
            </Button>
            <ThemeSwitcher />
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="sm:hidden overflow-hidden"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="px-2 pt-2 pb-3 space-y-1"
              >
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="flex flex-col gap-2 px-3 pt-2"
                >
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      Connexion
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      Inscription
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
