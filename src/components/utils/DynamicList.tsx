'use client';
import React from 'react';
import { AiOutlineSwapRight } from 'react-icons/ai';

type DynamicListProps = {
  items: string[];
  textSize?: string;
};

export default function DynamicList({ items, textSize = 'text-base' }: DynamicListProps) {
  return (
    <ul className={`${textSize} h-full flex flex-col justify-center overflow-y-auto`}>
      {items.map((item, index) => (
        <li key={index} className='flex items-center gap-x-2'>
            <AiOutlineSwapRight/>
            <p>{item}</p>
        </li>
      ))}
    </ul>
  );
}