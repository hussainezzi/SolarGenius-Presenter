
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-[#80cbc4] rounded-lg shadow-lg p-6 text-[#333333] ${className}`}>
      {title && <h3 className="text-2xl font-bold mb-4 text-[#333333]">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
