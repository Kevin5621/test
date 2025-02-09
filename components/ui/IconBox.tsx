import React from 'react';
import { cn } from '../../utils/cn';

interface IconBoxProps {
  className?: string;
  children: React.ReactNode;
}

const IconBox: React.FC<IconBoxProps> = ({ className, children }) => {
  return (
    <div className={cn(
      "p-4 rounded-lg shadow-neumorph",
      className
    )}>
      {children}
    </div>
  );
};

export default IconBox;