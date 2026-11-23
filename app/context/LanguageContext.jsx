"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";

const TRANSLATIONS = {
  en: {
    nav: {
      work: "Selected Work",
      capabilities: "Capabilities",
      experiments: "Experiments",
      contact: "Contact",
      talk: "Let's Talk",
    },
    hero: {
      title: "xboudreault",
      reimagining: "Reimagining",
      theWeb: " the web.",
      bio: "Full-stack software engineering meets editorial art direction. Building resilient digital products, interactive media, and tactile web interfaces from scratch.",
      badgeContracts: "Available Q2/Q3 for contracts",
      badgeStack: "TypeScript · Next.js · Creative Tech",
      badgeLocation: "Montreal, QC [EST]",
    },
    tv: {
      title: "SONY TRINITRON 1989",
      model: "MODEL XB-2026",
      vsync: "● VSYNC LOCKED",
      ch1Title: "tunnel vision",
      ch1Sub1: "> system_init: compiled successfully",
      ch1Sub2: "> latency: 14ms · 60fps",
      ch2Title: "audio oscillogram",
      ch2Sub1: "> synth_wave: 440.0Hz · stereo dsp",
      ch2Sub2: "> real-time canvas buffer active",
      ch3Title: "rocky-pouliot.vercel.app",
      ch3Sub1: "> civil_radar: Petite-Nation, QC",
      ch3Sub2: "> laser grading telemetry: 200 OK",
      ch4Title: "3d vector wireframe",
      ch4Sub1: "> glsl_matrix: rotating polygon",
      ch4Sub2: "> canvas_geometry: 60fps locked",
      signalOk: "SIGNAL CH-03 · RGB INPUT OK",
      knobHint: "CLICK KNOB TO CYCLE CHANNELS",
    },
    work: {
      titlePrefix: "Built with Creators & Code",
      titleSuffix: "you trust",
      viewArchive: "View All Projects Archive →",
    },
    matrix: {
      badge: "Capabilities Matrix",
      title: "The Jack of All Trades Advantage",
      subtitle:
        "Deep technical architecture fused with meticulous graphic design execution.",
      col1Title: "Engineering Architecture",
      col1Sub:
        "Designing performant, scalable distributed web platforms. Clean APIs, zero-runtime overhead, strict typing, and high-velocity shipping.",
      col1Points: [
        "Full-Stack JavaScript & React",
        "Next.js Server Components & SSR",
        "Database Schema Design (PostgreSQL)",
        "REST & GraphQL API Pipelines",
        "Microservices & Edge Functions",
      ],
      col2Title: "Digital Product Design",
      col2Sub:
        "Editorial typography, crisp layout rhythm, design tokens, and human-centered design that elevates functional web software into art.",
      col2Points: [
        "Design Systems & Tokens",
        "Editorial & High-End Art Direction",
        "Micro-Interactions & Framer Motion",
        "Figma Component Architecture",
        "Accessibility (WCAG AAA)",
      ],
      col3Title: "Creative Prototyping",
      col3Sub:
        "Turning conceptual ideas into working interactive software in days instead of quarters. Bridging the gap between founder vision and code.",
      col3Points: [
        "WebGL Shaders & Canvas Graphics",
        "Generative AI Integration",
        "0-to-1 MVP Buildout & Launch",
        "Technical Audits & Optimization",
        "Interactive Storytelling",
      ],
    },
    experiments: {
      badge: "Experiments & Dispatches",
      title: "The Living Feed & Lab",
      viewAll: "View All Open Source (GitHub) →",
      exp1Badge: "Interactive Shader",
      exp1Title: "Bespoke CRT Post-Processing Pass",
      exp1Desc:
        "GLSL fragment shader reproducing authentic phosphor trails and bezel curvature in pure WebGL.",
      exp1Status: "Demo Ready",
      exp2Badge: "Typography Tool",
      exp2Title: "Fluid Type Scale Calculator",
      exp2Desc:
        "Algorithmic clamp() generator for responsive editorial headlines across all viewport widths.",
      exp2Status: "npm package",
      exp3Badge: "Performance Lab",
      exp3Title: "Zero-Bundle State Store",
      exp3Desc:
        "Tiny 400-byte micro reactive event bus for synchronized multi-tab microfrontends.",
      exp3Status: "MIT License",
      exp4Badge: "Editorial Essay",
      exp4Title: "The Myth of the Pure Specialist",
      exp4Desc:
        "Why the future belongs to generalists who can write code, compose music, and refine typefaces.",
      exp4Status: "Read Essay →",
    },
    contact: {
      title: "Become a partner.",
      badge: "CONNECT WITH XAVIER TO BUILD RESILIENT, REFINED DIGITAL PRODUCTS.",
      lead: "Whether you need complete full-stack web engineering, an uncompromising art direction overhaul, or high-impact creative prototyping.",
      introBtn: "Schedule an Intro Call",
      cvBtn: "Download Curriculum Vitae",
      responseTime: "Response time: usually under 24 hours",
    },
    footer: {
      bio: "Developer, designer, craftsman. Combining high-level computer science fundamentals with timeless graphic sensibility.",
      networkTitle: "Network & Dispatches",
      clockTitle: "Location & Clock",
      location: "Montreal, QC, Canada",
      copyright: "© 2026 Xavier Boudreault. All rights reserved.",
      colophon: "Crafted with semantic HTML5 & Tailwind CSS. Hosted on the edge.",
    },
  },
  fr: {
    nav: {
      work: "Projets sélectionnés",
      capabilities: "Compétences",
      experiments: "Laboratoire",
      contact: "Contact",
      talk: "Parlons-en",
    },
    hero: {
      title: "xboudreault",
      reimagining: "Réinventer",
      theWeb: " le web.",
      bio: "L'ingénierie logicielle full-stack rencontre la direction artistique éditoriale. Conception de produits numériques résilients, de médias interactifs et d'interfaces tactiles sur mesure.",
      badgeContracts: "Disponible T2/T3 pour mandats",
      badgeStack: "JavaScript · Next.js · Tech Créative",
      badgeLocation: "Montréal, QC [HNE]",
    },
    tv: {
      title: "SONY TRINITRON 1989",
      model: "MODÈLE XB-2026",
      vsync: "● SYNCHRO V VEROUILLÉE",
      ch1Title: "vision tunnel",
      ch1Sub1: "> init_système: compilation réussie",
      ch1Sub2: "> latence: 14ms · 60ips",
      ch2Title: "oscillogramme audio",
      ch2Sub1: "> onde_synth: 440.0Hz · dsp stéréo",
      ch2Sub2: "> tampon canvas temps réel actif",
      ch3Title: "rocky-pouliot.vercel.app",
      ch3Sub1: "> radar_civil: Petite-Nation, QC",
      ch3Sub2: "> télémétrie nivellement: 200 OK",
      ch4Title: "vecteur fil de fer 3d",
      ch4Sub1: "> matrice_glsl: polygone en rotation",
      ch4Sub2: "> géométrie_canvas: 60ips verrouillées",
      signalOk: "SIGNAL CANAL-03 · ENTRÉE RVB OK",
      knobHint: "CLIQUER LE BOUTON POUR CHANGER DE CANAL",
    },
    work: {
      titlePrefix: "Conçu avec les créateurs & le code",
      titleSuffix: "de confiance",
      viewArchive: "Voir l'archive complète des projets →",
    },
    matrix: {
      badge: "Matrice des compétences",
      title: "L'avantage du profil hybride et polyvalent",
      subtitle:
        "Une architecture technique robuste fusionnée avec une exécution graphique méticuleuse.",
      col1Title: "Architecture & Ingénierie",
      col1Sub:
        "Conception de plateformes web distribuées, performantes et évolutives. APIs épurées, zéro surplus d'exécution, clarté et déploiement continu rapide.",
      col1Points: [
        "JavaScript & React Full-Stack",
        "Composants Serveur Next.js & SSR",
        "Modélisation de bases de données (PostgreSQL)",
        "Pipelines d'APIs REST & GraphQL",
        "Microservices & Fonctions Edge",
      ],
      col2Title: "Design de produit numérique",
      col2Sub:
        "Typographie éditoriale, rythme de mise en page précis, jetons de design et expérience humaine élevant les logiciels au rang d'œuvres d'art.",
      col2Points: [
        "Systèmes de design & jetons (Tokens)",
        "Direction artistique éditoriale haut de gamme",
        "Micro-interactions & Framer Motion",
        "Architecture de composants Figma",
        "Accessibilité stricte (WCAG AAA)",
      ],
      col3Title: "Prototypage créatif",
      col3Sub:
        "Transformer des concepts abstraits en logiciels interactifs opérationnels en quelques jours. Faire le pont entre la vision du fondateur et le code de production.",
      col3Points: [
        "Shaders WebGL & Graphiques Canvas",
        "Intégration d'IA générative",
        "Création de MVP 0 à 1 & lancement",
        "Audits techniques & optimisations",
        "Récit interactif (Storytelling)",
      ],
    },
    experiments: {
      badge: "Expériences & Dépêches",
      title: "Flux en direct & Laboratoire",
      viewAll: "Voir tous les projets Open Source (GitHub) →",
      exp1Badge: "Shader interactif",
      exp1Title: "Passe post-traitement CRT sur mesure",
      exp1Desc:
        "Shader fragment GLSL reproduisant les traînées de phosphore et la courbure authentique en WebGL pur.",
      exp1Status: "Démo prête",
      exp2Badge: "Outil typographique",
      exp2Title: "Calculateur d'échelle typographique fluide",
      exp2Desc:
        "Générateur algorithmique clamp() pour titres éditoriaux adaptatifs sur toutes largeurs d'écran.",
      exp2Status: "Package npm",
      exp3Badge: "Lab performance",
      exp3Title: "Gestionnaire d'état à empreinte zéro",
      exp3Desc:
        "Micro-bus d'événements réactifs de 400 octets synchronisé pour micro-frontends multi-onglets.",
      exp3Status: "Licence MIT",
      exp4Badge: "Essai éditorial",
      exp4Title: "Le mythe du pur spécialiste",
      exp4Desc:
        "Pourquoi l'avenir appartient aux généralistes capables de coder, composer de la musique et polir des caractères.",
      exp4Status: "Lire l'essai →",
    },
    contact: {
      title: "Devenons partenaires.",
      badge: "COLLABOREZ AVEC XAVIER POUR BÂTIR DES PRODUITS NUMÉRIQUES D'EXCEPTION.",
      lead: "Que vous ayez besoin d'une ingénierie web full-stack complète, d'une refonte sans compromis de votre direction artistique ou d'un prototype créatif à fort impact.",
      introBtn: "Planifier un appel d'introduction",
      cvBtn: "Télécharger le Curriculum Vitae",
      responseTime: "Délai de réponse : habituellement moins de 24 heures",
    },
    footer: {
      bio: "Développeur, designer, artisan. Allier les fondamentaux de l'informatique avec une sensibilité graphique intemporelle.",
      networkTitle: "Réseaux & Dépêches",
      clockTitle: "Emplacement & Horloge",
      location: "Montréal, QC, Canada",
      copyright: "© 2026 Xavier Boudreault. Tous droits réservés.",
      colophon: "Conçu avec HTML5 sémantique & Tailwind CSS. Hébergé sur le réseau Edge.",
    },
  },
};

const LanguageContext = createContext(undefined);

const subscribeToStorage = (callback) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getClientSnapshot = () => {
  try {
    const saved = localStorage.getItem("xb_portfolio_lang");
    if (saved === "en" || saved === "fr") return saved;
    if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("fr")) {
      return "fr";
    }
  } catch {
    // fallback
  }
  return "en";
};

const getServerSnapshot = () => "en";

export function LanguageProvider({ children }) {
  const [overrideLang, setOverrideLang] = useState(null);

  const clientLang = useSyncExternalStore(
    subscribeToStorage,
    getClientSnapshot,
    getServerSnapshot
  );

  const language = overrideLang ?? clientLang;

  const setLanguage = (lang) => {
    setOverrideLang(lang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("xb_portfolio_lang", lang);
      } catch {
        // ignore
      }
    }
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "fr" : "en";
    setLanguage(next);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: TRANSLATIONS[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
