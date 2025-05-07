import React, { ReactNode } from 'react';

interface SectionDivProps {
  sectionTitle: string;
  children: ReactNode;
}

const SectionDiv: React.FC<SectionDivProps> = ({ sectionTitle, children }) => {
  return (
    <section className="flex flex-col items-center bg-white text-gray-700 px-10 py-4 text-base md:text-lg">
      <p className="text-2xl font-bold mb-6">{sectionTitle}</p>
      {children}
    </section>
  );
};

export default SectionDiv;
