import React from "react";
import { DiMysql, DiPostgresql } from "react-icons/di";
import { FaBootstrap, FaCss3Alt, FaHtml5, FaNode, FaPhp, FaSymfony } from "react-icons/fa";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { SiTypescript } from "react-icons/si";
import SectionDiv from "../utils/SectionDiv";

export default function SkillsSections() {
  return (
    <SectionDiv sectionTitle="Mes compétences">
        <div className="flex flex-col md:flex-row gap-y-10 md:gap-x-10 items-center">
            <div>
                <p className="text-center font-bold mb-5">Front-End</p>
                <ul className="flex flex-row text-base gap-x-3 mb-5">
                    <li className="flex flex-col justify-center items-center gap-y-2"> <p>HTML</p><FaHtml5 size={36}/></li>
                    <li className="flex flex-col justify-center items-center gap-y-2"> <p>CSS</p><FaCss3Alt size={36}/></li>
                    <li className="flex flex-col justify-center items-center gap-y-2"> <p>Typescript</p><SiTypescript size={36}/></li>
                    <li className="flex flex-col justify-center items-center gap-y-2"> <p>Next.js</p><RiNextjsFill size={36}/></li>
                    <li className="flex flex-col justify-center items-center gap-y-2"> <p>tailwind</p><RiTailwindCssFill size={36}/></li>
                    <li className="flex flex-col justify-center items-center gap-y-2"> <p>bootstrap</p><FaBootstrap size={36}/></li>
                </ul>        
            </div>

            <div>
                <p className="text-center font-bold mb-5">Back-End</p>
                <ul className="flex flex-row text-base gap-x-3 mb-5">
                    <li className="flex flex-col justify-center items-center gap-y-2"> <p>Node.js</p><FaNode size={36}/></li>
                    <li className="flex flex-col justify-center items-center gap-y-2"> <p>Php</p><FaPhp size={36}/></li>
                    <li className="flex flex-col justify-center items-center gap-y-2"> <p>Symfony</p><FaSymfony size={36}/></li>
                    <li className="flex flex-col justify-center items-center gap-y-2"> <p>MySQL</p><DiMysql  size={36}/></li>
                    <li className="flex flex-col justify-center items-center gap-y-2"> <p>PostgreSQL</p><DiPostgresql   size={36}/></li>
                </ul>        
            </div>
        </div>
  </SectionDiv>
  );
};