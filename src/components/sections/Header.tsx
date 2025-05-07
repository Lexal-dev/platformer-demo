import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex flex-row w-full items-center justify-between px-5 py-4 z-10">
      <p className="text-xl md:text-3xl font-bold">Landolt Alexis</p>

      {/* Desktop view: affichage horizontal classique */}
      <ul className="hidden md:flex flex-row text-base md:text-xl gap-x-5">
        <li><a href="#about" className="hover:text-green-500">À propos</a></li>
        <li><a href="#skill" className="hover:text-green-500">Mes compétences</a></li>
        <li><a href="#project" className="hover:text-green-500">Mes projets</a></li>
        <li><a href="#contact" className="hover:text-green-500">Contact</a></li>
      </ul>

      {/* Mobile view: menu déroulant via bouton */}
      <div className="relative md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-base font-medium hover:text-green-500"
        >
          Navigation ▾
        </button>
        {isOpen && (
          <ul className="absolute right-0 mt-2 w-48 bg-slate-200 text-black shadow-lg rounded-md z-20 text-base">
            <li><a href="#about" className="block px-4 py-2 hover:bg-gray-100 hover:text-green-500">À propos</a></li>
            <li><a href="#skill" className="block px-4 py-2 hover:bg-gray-100 hover:text-green-500">Mes compétences</a></li>
            <li><a href="#project" className="block px-4 py-2 hover:bg-gray-100 hover:text-green-500">Mes projets</a></li>
            <li><a href="#contact" className="block px-4 py-2 hover:bg-gray-100 hover:text-green-500">Contact</a></li>
          </ul>
        )}
      </div>
    </header>
  );
}