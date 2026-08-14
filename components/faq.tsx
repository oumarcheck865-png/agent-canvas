"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function Faq() {
  const accordionItems = [
    {
      title: "Qu'est-ce qu'Agent Canvas ?",
      content: (
        <div className="text-muted-foreground">
          Agent Canvas est une plateforme IA professionnelle qui vous permet de
          concevoir, déployer et superviser des agents autonomes propulsés par
          OpenHands.
        </div>
      ),
    },
    {
      title: "Comment fonctionne l'intégration OpenHands ?",
      content: (
        <div className="text-muted-foreground">
          Le moteur OpenHands sert de backend agent. Vous pouvez en savoir plus
          sur le projet officiel :{" "}
          <a
            href="https://github.com/All-Hands-AI/OpenHands"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            GitHub
          </a>
        </div>
      ),
    },
    {
      title: "Puis-je utiliser Agent Canvas en production ?",
      content: (
        <div className="text-muted-foreground">
          Oui. Agent Canvas est conçu pour la production, avec une
          infrastructure hautement disponible et des garanties de disponibilité
          pour vos workflows d'automatisation.
        </div>
      ),
    },
    {
      title: "Comment puis-je me lancer ?",
      content: (
        <div className="text-muted-foreground">
          Créez un compte depuis la page d'inscription, puis configurez votre
          premier agent. Vous pouvez commencer gratuitement avec le plan
          Découverte.
        </div>
      ),
    },
  ];

  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      whileInView={{
        y: 0,
        opacity: 1,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.5, type: "spring", bounce: 0 }}
      className="relative w-full max-w-(--breakpoint-xl) mx-auto px-4 py-28 gap-5 md:px-8 flex flex-col justify-center items-center"
    >
      <div className="flex flex-col gap-3 justify-center items-center">
        <h4 className="text-2xl font-bold sm:text-3xl bg-linear-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
          FAQ
        </h4>
        <p className="max-w-xl text-muted-foreground text-center">
          Voici les questions les plus fréquemment posées.
        </p>
      </div>
      <div className="flex w-full max-w-lg">
        <Accordion type="multiple" className="w-full">
          {accordionItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="text-muted-foreground"
            >
              <AccordionTrigger className="text-left">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.section>
  );
}
