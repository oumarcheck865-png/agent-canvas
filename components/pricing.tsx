"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckIcon } from "@radix-ui/react-icons";

export default function Pricing() {
  const plans = [
    {
      name: "Découverte",
      desc: "Pour démarrer avec vos premiers agents",
      price: 0,
      isMostPop: false,
      features: [
        "1 agent autonome",
        "Exécution de tâches basique",
        "Analyse limitée",
      ],
    },
    {
      name: "Pro",
      desc: "Pour les équipes en croissance",
      price: 29,
      isMostPop: true,
      features: [
        "Tout le plan Découverte",
        "Agents multi-outils",
        "Support prioritaire",
        "Sessions collaboratives",
        "Intégrations personnalisées",
      ],
    },
    {
      name: "Entreprise",
      desc: "Pour les grandes organisations",
      price: 99,
      isMostPop: false,
      features: [
        "Tout le plan Pro",
        "Sécurité avancée",
        "Marque personnalisée",
        "Support dédié",
        "Garantie SLA",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="mx-auto w-full max-w-7xl px-3 py-16 sm:px-4 sm:py-24 md:px-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12 flex flex-col gap-3 text-center sm:mb-16"
      >
        <h2 className="text-xl font-semibold sm:text-2xl bg-linear-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
          Choisissez votre plan
        </h2>
        <p className="mx-auto max-w-xl text-muted-foreground text-center">
          Sélectionnez le plan adapté à vos besoins. Changez de plan à tout
          moment.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative ${plan.isMostPop ? "md:scale-[1.03]" : ""}`}
          >
            <Card
              className={`relative h-full rounded-2xl ${
                plan.isMostPop
                  ? "border-2 border-primary bg-primary/5 shadow-lg"
                  : "border border-border"
              }`}
            >
              {plan.isMostPop && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="rounded-full border-2 border-primary bg-card px-3 py-1 text-xs font-medium sm:px-4 sm:text-sm">
                    Le plus populaire
                  </span>
                </div>
              )}

              <CardContent className="p-4 pt-6 sm:p-6 sm:pt-8">
                <div className="mb-5 text-center sm:mb-6">
                  <h3 className="mb-2 text-lg font-semibold sm:text-xl">
                    {plan.name}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground sm:mb-4">
                    {plan.desc}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold sm:text-4xl">
                      ${plan.price}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground sm:text-base">
                      /mois
                    </span>
                  </div>
                </div>

                <Separator className="my-4 sm:my-6" />

                <ul className="space-y-2.5 sm:space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-xs sm:text-sm"
                    >
                      <CheckIcon className="mr-2 h-4 w-4 shrink-0 text-primary sm:mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
                <Button
                  className="w-full"
                  variant={plan.isMostPop ? "default" : "outline"}
                  size="lg"
                >
                  {plan.price === 0 ? "Démarrer gratuitement" : "Choisir ce plan"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
