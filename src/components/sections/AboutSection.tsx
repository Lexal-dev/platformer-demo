import React from "react";
import SectionDiv from "../utils/SectionDiv";

export default function AboutSection() {
    return (
        <SectionDiv sectionTitle="Qui suis-je ?">
            <div className="w-full text-base md:text-lg">
                <p>
                  Je m'appelle Alexis Landolt, <strong>développeur web et web mobile</strong>.
                </p>
                <p className="mt-4">
                  Après une reconversion professionnelle, j'ai suivi une formation diplômante en développement web et web mobile au sein de l'école en ligne <strong>Studi</strong>.
                  Durant cette formation, j'ai acquis des compétences solides en <strong>HTML, CSS</strong> et <strong>JavaScript</strong>, tout en découvrant d'autres langages et frameworks.
                </p>
                <p className="mt-4">
                  Forcé de constater qu'il y a une multitude de langages et frameworks, j'ai choisi de me spécialiser en <strong>React</strong>, avec une expertise croissante sur le framework <strong>Next.js</strong>.
                  Aujourd'hui, je poursuis mon parcours en intégrant une licence axée sur la <strong>programmation en C#</strong>, avec pour objectif de renforcer mes compétences en développement logiciel.
                </p>
                <p className="mt-4">
                  Actuellement à la recherche d'une opportunité professionnelle dans le domaine du développement web, je suis motivé, rigoureux et prêt à m'investir pleinement dans de nouveaux projets et entreprises.
                </p>
            </div>
        </SectionDiv>
    );
};
