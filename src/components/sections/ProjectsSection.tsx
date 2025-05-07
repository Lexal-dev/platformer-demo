import React from "react";
import SectionDiv from "../utils/SectionDiv";
import Image from "next/image";
import { isMobile, isTablet } from "react-device-detect";
import { useRouter } from "next/navigation";


export default function ProjectsSection() {

    const router = useRouter();

    const handleDemoClick = () => {
        if (!isMobile && !isTablet) { 
          router.push("/gameDemo");
        } else {
          alert("Ce projet n'est pas disponible sur mobile ou tablette.");
        }
      };
      const handleClickCredits = () => {
        router.push("/sonoreCredits")
      }
    return (
    <SectionDiv sectionTitle="Mes projets">
<div className="w-full text-left text-black">
  {/* === Platformer2D-phaser === */}
  <div>
    <p className="text-center text-xl font-bold py-10">Platformer2D-phaser</p>
    <p className="mb-2">
      Le projet est disponible sur GitHub :{' '}
      <a
        href="https://github.com/Lexal-dev/platformer-demo"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        https://github.com/Lexal-dev/platformer-demo
      </a>
    </p>
    <div className="w-full flex justify-center py-5">
      <Image
        src={"/site/game-demo.png"}
        alt="game-demo"
        width={500}
        height={500}
        className="rounded-lg shadow-lg"
      />
    </div>

    <p className="font-semibold text-lg mb-1">Description :</p>
    <p className="mb-2">
      Ce projet a été réalisé avec le framework Phaser dans le but de créer un jeu 2D de type
      platformer. Il a permis de découvrir et de maîtriser une nouvelle technologie tout en
      développant une démo jouable.
    </p>

    <p>Voici les principales fonctionnalités mises en place :</p>
    <ul className="list-disc pl-5 mb-2">
      <li>Développement du système du joueur avec gestion des déplacements et des actions.</li>
      <li>Création d'un système d'ennemis avec intelligence artificielle basique.</li>
      <li>Implémentation d'interactions avec des éléments de carte (objets, plateformes, etc.).</li>
      <li>Mise en place d'un système de pause permettant d'interrompre le jeu à tout moment.</li>
      <li>Création d'un système d'interface utilisateur (HUD) pour afficher des informations essentielles (score, vie, etc.).</li>
      <li>Ajout d'effets sonores et de musique pour une meilleure immersion.</li>
    </ul>
    <p>
      L'objectif principal de ce projet était d'apprendre à utiliser une technologie que je n'avais
      jamais utilisée auparavant, Phaser, tout en développant un jeu 2D complet et fonctionnel.
    </p>
    <button className="font-bold hover:text-green-500 cursor-pointer" onClick={handleClickCredits}>Afficher la liste des crédits (effets sonores et musiques).</button>
    <div className="w-full flex justify-center py-20">
      <button
        onClick={handleDemoClick}
        className="font-bold p-3 border-3 rounded-lg cursor-pointer hover:bg-green-100 hover:border-green-700 hover:text-green-700 transition duration-300 ease-in-out"
      >
        ESSAYER LA DEMO
      </button>
    </div>
  </div>

  {/* === ECF - Arcadia === */}
  <div>
    <p className="text-center text-xl font-bold py-10">ECF - Arcadia site web</p>
    <p className="mb-2">
      Le projet est disponible sur GitHub :{' '}
      <a
        href="https://github.com/Lexal-dev/final-ecf-arcadia"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        https://github.com/Lexal-dev/final-ecf-arcadia
      </a>
    </p>

    <div className="w-full flex justify-center py-5">
      <Image
        src={"/site/arcadia-site.png"}
        alt="arcadia-site"
        width={500}
        height={500}
        className="rounded-lg shadow-lg"
      />
    </div>

    <p className="font-semibold text-lg mb-1">Description :</p>
    <p className="mb-2">
      Ce projet simule la création d’un site web pour un zoo fictif nommé **Arcadia**. Il a impliqué une démarche complète de conception web.
    </p>

    <p>Voici les principales sections et fonctionnalités développées :</p>
    <ul className="list-disc pl-5 mb-2">
      <li>Préparation et définition de la stack technique adaptée au projet.</li>
      <li>Réalisation de maquettes UI pour les différentes interfaces.</li>
      <li>Section visiteurs : consultation des animaux, horaires, services et formulaire de contact.</li>
      <li>Section employés : interface de gestion des animaux et des services internes.</li>
      <li>Section vétérinaire : outils pour le suivi de santé des animaux.</li>
      <li>Section administrateur : contrôle complet du site et des utilisateurs.</li>
    </ul>
    <p>
      Ce projet avait pour but de mettre en œuvre une architecture complète de site web, avec gestion de rôles utilisateurs et interfaces adaptées à chaque besoin métier.
    </p>
  </div>
</div>
    </SectionDiv>
  );
};
