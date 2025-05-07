"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
    "Bonjour, je suis Landolt Alexis.",
    "Développeur web à la recherche de nouvelles opportunités.",
    "Pour en savoir plus, rendez-vous dans la section À propos.",
    "Des questions ou besoin d'informations supplémentaires ?",
    "N'hésitez pas à me contacter.",
  ];

export default function TypewriterText() {
  const [displayedText, setDisplayedText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) return;
  
    const currentMessage = messages[messageIndex];
  
    if (messageIndex === messages.length - 1 && !isDeleting && charIndex === currentMessage.length + 1) {
      return;
    }
  
    const handleTyping = () => {
      if (!isDeleting && charIndex <= currentMessage.length) {
        setDisplayedText(currentMessage.substring(0, charIndex));
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex >= 0) {
        setDisplayedText(currentMessage.substring(0, charIndex));
        setCharIndex((prev) => prev - 1);
      }
  
      if (charIndex === currentMessage.length + 1 && !isDeleting) {
        setPause(true);
        setTimeout(() => {
          setIsDeleting(true);
          setPause(false);
        }, 2000);
      }
  
      if (charIndex === 0 && isDeleting) {
        setIsDeleting(false);
        setMessageIndex((prev) => {
          if (prev + 1 < messages.length) return prev + 1;
          return prev;
        });
      }
    };
  
    const speed = isDeleting ? 20 : 80;
    const timeout = setTimeout(handleTyping, speed);
  
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, messageIndex, pause]);
  
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {displayedText}
      <span className="animate-pulse">|</span>
    </motion.div>
  );
}