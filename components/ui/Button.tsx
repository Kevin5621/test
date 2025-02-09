import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'link';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'default',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        "px-8 py-3 rounded-lg bg-gray-100 text-gray-700 transition-shadow",
        variant === 'default' && "shadow-neumorph hover:shadow-neumorph-hover active:shadow-neumorph-inset",
        variant === 'link' && "hover:text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;