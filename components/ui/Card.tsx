import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={cn(
      "rounded-2xl shadow-neumorph p-6 transition-all hover:shadow-neumorph-hover",
      className
    )}>
      {children}
    </div>
  );
};

export default Card;