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
    projects: [
      {
        id: "01",
        category: "Selected Case",
        title: "The Human Element",
        bannerSubtitle: "Directed & Engineered by Xavier",
        bannerQuote: "“Truth, told beautifully with high-frequency telemetry.”",
        techHeader: "Next.js 14 · WebGL Canvas · Supabase",
        status: "Live Case Study",
        spotlight: "PROJECT SPOTLIGHT · 2025",
        fullTitle: "The Human Element: Interactive Media Platform",
        description:
          "In a digital landscape crowded with automated noise, the platform delivers intimate, high-impact investigative documentary web experiences. Featuring custom video timeline streaming, interactive mapping, and low-latency reader dispatches.",
        tags: [
          "JavaScript",
          "Next.js App Router",
          "Tailwind CSS",
          "Three.js / WebGL",
          "Node Engine",
        ],
        quotePrefix: "This is a ",
        quoteStrong: "new way",
        quoteMiddle: " to experience media. One where we don’t just observe code — ",
        quoteEm: "we step into it",
        quoteSuffix: " and build the future together.",
        deployLabel: "Production Deploy",
        ctaLabel: "Explore Codebase →",
        clientType: "Investigative Journalism Media",
        year: "2025",
      },
      {
        id: "02",
        category: "Civil & Infrastructure",
        title: "Aménagement R.P.",
        bannerSubtitle: "Architecture & Interface by Xavier",
        bannerQuote:
          "“Heavy civil engineering precision meets high-performance web performance.”",
        techHeader: "Next.js App Router · JavaScript · Tailwind CSS · Vercel",
        status: "Live Production",
        spotlight: "PRODUCTION CLIENT · 2025",
        fullTitle:
          "Aménagement R.P. — Heavy Civil Engineering & Excavation Platform",
        description:
          "A flagship web platform engineered for an elite excavation and civil engineering leader in Outaouais and Petite-Nation. Features precision laser-grading showcases, bilingual localization, dynamic project portfolios, and high-conversion client inquiry pipelines.",
        tags: [
          "Next.js",
          "JavaScript",
          "Tailwind CSS",
          "Vercel Edge",
          "i18n Architecture",
          "SEO",
        ],
        quotePrefix: "Civil engineering demands absolute precision. ",
        quoteStrong: "Aménagement R.P.",
        quoteMiddle: " brings that same standard to the browser with ",
        quoteEm: "commanding industrial clarity",
        quoteSuffix: " and sub-millisecond execution.",
        deployLabel: "rocky-pouliot.vercel.app",
        ctaLabel: "Visit Live Platform ↗",
        link: "https://rocky-pouliot.vercel.app",
        clientType: "Commercial Civil Engineering Firm",
        year: "2025",
      },
      {
        id: "03",
        category: "Fintech Platform",
        title: "Ledger & Vector",
        bannerSubtitle: "Architecture & Interface by Xavier",
        bannerQuote: "“Sub-millisecond financial clarity without visual clutter.”",
        techHeader: "React · JavaScript · PostgreSQL · WebSockets",
        status: "Production",
        spotlight: "FINTECH ARCHITECTURE · 2025",
        fullTitle: "Ledger & Vector: Real-Time Treasury Engine",
        description:
          "A multi-currency liquidity dashboard engineered for high-frequency reconciliation. Built with optimistic UI updates, keyboard-first navigation, and deterministic state machines.",
        tags: ["JavaScript", "React", "PostgreSQL", "Tailwind CSS", "WebSockets"],
        quotePrefix: "Financial software usually feels like a spreadsheet from 1998. ",
        quoteStrong: "Ledger & Vector",
        quoteMiddle: " turns complex liquidity flows into ",
        quoteEm: "effortless tactile control",
        quoteSuffix: ".",
        deployLabel: "Enterprise Release",
        ctaLabel: "Explore Codebase →",
        clientType: "Enterprise Financial Infrastructure",
        year: "2025",
      },
      {
        id: "04",
        category: "Design System",
        title: "Atelier Kinetic UI",
        bannerSubtitle: "Design Tokens & Component Library",
        bannerQuote: "“Editorial precision meets physics-driven motion.”",
        techHeader: "React · Radix Primitives · Framer Motion",
        status: "Open Source",
        spotlight: "SYSTEM ARCHITECTURE · 2026",
        fullTitle: "Atelier Kinetic UI: Editorial Component Primitives",
        description:
          "A headless-first UI kit marrying classic Swiss typographic grids with spring-physics micro-interactions and strict WCAG AAA contrast compliance.",
        tags: ["Design Tokens", "React", "Framer Motion", "WCAG AAA", "Storybook"],
        quotePrefix: "A design system should never flatten a brand’s soul. ",
        quoteStrong: "Atelier Kinetic",
        quoteMiddle: " codifies ",
        quoteEm: "typographic rhythm",
        quoteSuffix: " directly into reusable primitives.",
        deployLabel: "v2.4 Published",
        ctaLabel: "Explore Codebase →",
        clientType: "Open-Source Design System",
        year: "2026",
      },
      {
        id: "05",
        category: "Editorial WebGL",
        title: "Cartography Zero",
        bannerSubtitle: "Custom GLSL Shaders & Spatial Audio",
        bannerQuote: "“Navigating acoustic landscapes in 60fps.”",
        techHeader: "Three.js · GLSL · Web Audio API",
        status: "Interactive",
        spotlight: "CREATIVE TECH · 2026",
        fullTitle: "Cartography Zero: Spatial Sound & Terrain Archive",
        description:
          "An interactive 3D elevation map pairing archival field recordings with custom vertex displacement shaders and procedural CRT post-processing.",
        tags: ["Three.js", "GLSL Shaders", "Web Audio API", "Next.js"],
        quotePrefix: "By treating the browser as a ",
        quoteStrong: "real-time canvas",
        quoteMiddle: ", Cartography Zero transforms raw geospatial data into ",
        quoteEm: "living memory",
        quoteSuffix: ".",
        deployLabel: "Exhibition Build",
        ctaLabel: "Explore Codebase →",
        clientType: "Museum Exhibition & Archival Sound",
        year: "2026",
      },
    ],
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
    projects: [
      {
        id: "01",
        category: "Étude de cas",
        title: "The Human Element",
        bannerSubtitle: "Réalisé & Développé par Xavier",
        bannerQuote: "« La vérité, racontée avec beauté et télémétrie haute fréquence. »",
        techHeader: "Next.js 14 · WebGL Canvas · Supabase",
        status: "Étude en direct",
        spotlight: "PROJET VEDETTE · 2025",
        fullTitle: "The Human Element : Plateforme Média Interactive",
        description:
          "Dans un écosystème numérique saturé de bruit automatisé, la plateforme propose des expériences documentaires d'investigation immersives. Diffusion vidéo avec synchronisation temporelle sur mesure, cartographie interactive et dépêches en direct.",
        tags: [
          "JavaScript",
          "Next.js App Router",
          "Tailwind CSS",
          "Three.js / WebGL",
          "Node Engine",
        ],
        quotePrefix: "Voici une ",
        quoteStrong: "nouvelle manière",
        quoteMiddle: " d'expérimenter les médias. Une où l'on n'observe pas le code — ",
        quoteEm: "on s'y plonge",
        quoteSuffix: " pour façonner l'avenir ensemble.",
        deployLabel: "Déploiement Production",
        ctaLabel: "Explorer le code →",
        clientType: "Média de journalisme d'investigation",
        year: "2025",
      },
      {
        id: "02",
        category: "Génie civil & Travaux",
        title: "Aménagement R.P.",
        bannerSubtitle: "Architecture & Interface par Xavier",
        bannerQuote:
          "« La précision du génie civil lourd alliée à la performance web moderne. »",
        techHeader: "Next.js App Router · JavaScript · Tailwind CSS · Vercel",
        status: "Production en direct",
        spotlight: "CLIENT EN PRODUCTION · 2025",
        fullTitle:
          "Aménagement R.P. — Plateforme d'excavation & génie civil lourd",
        description:
          "Plateforme web de référence conçue pour un leader de l'excavation et du génie civil en Outaouais et Petite-Nation. Vitrine de nivellement laser haute précision, bilinguisme intégral, galeries de réalisations dynamiques et entonnoir d'acquisition direct.",
        tags: [
          "Next.js",
          "JavaScript",
          "Tailwind CSS",
          "Vercel Edge",
          "Architecture i18n",
          "SEO",
        ],
        quotePrefix: "Le génie civil exige une rigueur mathématique absolue. ",
        quoteStrong: "Aménagement R.P.",
        quoteMiddle: " transpose cette même exigence sur le web avec ",
        quoteEm: "une autorité industrielle indéniable",
        quoteSuffix: " et une vitesse instantanée.",
        deployLabel: "rocky-pouliot.vercel.app",
        ctaLabel: "Visiter le site en direct ↗",
        link: "https://rocky-pouliot.vercel.app",
        clientType: "Entreprise commerciale de génie civil",
        year: "2025",
      },
      {
        id: "03",
        category: "Plateforme Fintech",
        title: "Ledger & Vector",
        bannerSubtitle: "Architecture & Interface par Xavier",
        bannerQuote: "« Clarté financière sub-milliseconde sans encombrement visuel. »",
        techHeader: "React · JavaScript · PostgreSQL · WebSockets",
        status: "Production",
        spotlight: "ARCHITECTURE FINTECH · 2025",
        fullTitle: "Ledger & Vector : Moteur de trésorerie en temps réel",
        description:
          "Tableau de bord de liquidité multidevise conçu pour la réconciliation haute fréquence. Mises à jour d'interface optimistes, navigation prioritaire au clavier et automates à états finis déterministes.",
        tags: ["JavaScript", "React", "PostgreSQL", "Tailwind CSS", "WebSockets"],
        quotePrefix: "Les logiciels financiers ressemblent souvent à des tableurs de 1998. ",
        quoteStrong: "Ledger & Vector",
        quoteMiddle: " transforme les flux de liquidité complexes en un ",
        quoteEm: "contrôle tactile sans effort",
        quoteSuffix: ".",
        deployLabel: "Version Entreprise",
        ctaLabel: "Explorer le code →",
        clientType: "Infrastructure financière d'entreprise",
        year: "2025",
      },
      {
        id: "04",
        category: "Système de Design",
        title: "Atelier Kinetic UI",
        bannerSubtitle: "Jetons de design & Bibliothèque de composants",
        bannerQuote: "« La précision éditoriale rencontre le mouvement physique. »",
        techHeader: "React · Primitives Radix · Framer Motion",
        status: "Open Source",
        spotlight: "ARCHITECTURE DE SYSTÈME · 2026",
        fullTitle: "Atelier Kinetic UI : Primitives de composants éditoriaux",
        description:
          "Kit d'interface sans tête (headless) mariant les grilles typographiques suisses classiques avec des micro-interactions à ressort physique et une conformité WCAG AAA stricte.",
        tags: ["Jetons de Design", "React", "Framer Motion", "WCAG AAA", "Storybook"],
        quotePrefix: "Un système de design ne devrait jamais affadir l'âme d'une marque. ",
        quoteStrong: "Atelier Kinetic",
        quoteMiddle: " codifie le ",
        quoteEm: "rythme typographique",
        quoteSuffix: " directement en briques réutilisables.",
        deployLabel: "v2.4 Publiée",
        ctaLabel: "Explorer le code →",
        clientType: "Système de design open source",
        year: "2026",
      },
      {
        id: "05",
        category: "WebGL Éditorial",
        title: "Cartography Zero",
        bannerSubtitle: "Shaders GLSL sur mesure & Audio spatial",
        bannerQuote: "« Naviguer des paysages acoustiques à 60ips. »",
        techHeader: "Three.js · GLSL · Web Audio API",
        status: "Interactif",
        spotlight: "TECH CRÉATIVE · 2026",
        fullTitle: "Cartography Zero : Archive de relief et de sons spatiaux",
        description:
          "Carte d'élévation 3D interactive jumelant enregistrements de terrain d'archives avec shaders de déplacement de sommets personnalisés et post-traitement CRT procédural.",
        tags: ["Three.js", "Shaders GLSL", "Web Audio API", "Next.js"],
        quotePrefix: "En traitant le navigateur comme un ",
        quoteStrong: "canevas en temps réel",
        quoteMiddle: ", Cartography Zero transforme les données géospatiales brutes en ",
        quoteEm: "mémoire vivante",
        quoteSuffix: ".",
        deployLabel: "Version d'exposition",
        ctaLabel: "Explorer le code →",
        clientType: "Exposition muséale & Son d'archive",
        year: "2026",
      },
    ],
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
