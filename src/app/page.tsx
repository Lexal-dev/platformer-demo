"use client";

import TypewriterText from "@/components/TypewriterText";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSections from "@/components/sections/SkillsSections";
import ProjectsSection from "@/components/sections/ProjectsSection";
import Header from "@/components/sections/Header";

export default function Home() {
  
  const SpacerDiv = () => {
    return(<div className="py-[100px]" />)
  }

  return (
    <div className="w-full min-h-screen flex flex-col text-white">
    
    <Header />

      <div className="flex items-center justify-center w-full h-[55vh] text-2xl md:text-5xl md:px-2">
        <TypewriterText />
      </div>

      <div id="about">
        <AboutSection />
      </div>
      <SpacerDiv />
      
      <div id="skill">
        <SkillsSections />
      </div>
      <SpacerDiv />
      
      <div id="project">
        <ProjectsSection />
      </div>
      <SpacerDiv />
      
      <footer className="flex flex-col items-center bg-black border-t-2 text-white px-10 py-4 text-base md:text-lg gap-y-5">
        <p id="contact" className="text-2xl font-bold text-start">Me contacter</p>
        <ul className="mb-10">
          <li className="flex flex-row items-center gap-x-4">
            <FaPhone />
            <a href="tel:0678186931" className="hover:text-green-300">
              06 78 18 69 31
            </a>
          </li>
          <li className="flex flex-row items-center gap-x-4">
            <MdOutlineEmail />
            <a href="mailto:alexislandolt67@gmail.com" className="hover:text-green-300">
              alexislandolt67@gmail.com
            </a>
          </li>
        </ul>
        <p className="text-xs md:text-base">© Copyright 2025 - Alexis Landolt. Tous droits réservés..</p>
      </footer>
    </div>
  );
}
