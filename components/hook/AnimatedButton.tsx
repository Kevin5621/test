import { useState, useEffect } from "react";
import { Typewriter } from "./Animated_typeWritter";
import { useTheme } from "../../styles/themeContexts";

export interface AnimatedButtonProps {
  text: string;
  delay: number;
  buttonVisible: boolean;
  onClick?: () => void;
  icon?: React.ReactNode | null;
  parentRef?: React.RefObject<HTMLElement>;
  variant?: 'default' | 'subtle';
  width?: 'auto' | 'full' | 'default';
  type?: 'button' | 'submit';
}

export const AnimatedButton = ({ 
  text, 
  delay, 
  buttonVisible, 
  onClick, 
  icon = null,
  parentRef,
  variant = 'default',
  width = 'default',
  type = 'button'
}: AnimatedButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);
  const { theme } = useTheme();

  // Force rerender when theme changes
  useEffect(() => {
    const forceUpdate = () => {
      setScrollProgress(prev => prev + 0.01);
      setTimeout(() => setScrollProgress(prev => Math.max(prev - 0.01, 0)), 50);
    };
    forceUpdate();
  }, [theme]);

  useEffect(() => {
    if (buttonVisible) {
      const timer = setTimeout(() => {
        setContentVisible(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setContentVisible(false);
    }
  }, [buttonVisible]);

  useEffect(() => {
    const handleScroll = () => {
      if (parentRef?.current) {
        const rect = parentRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
        const maxDistance = windowHeight * 0.3;
        const progress = Math.min(Math.max(distanceFromCenter / maxDistance, 0), 1);
        
        if (distanceFromCenter < 100) {
          setScrollProgress(0);
        } else {
          setScrollProgress(progress);
        }
      } else {
        const scrolled = Math.min(
          Math.max(window.scrollY / (window.innerHeight * 0.3), 0),
          1
        );
        setScrollProgress(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parentRef]);
  
  const getButtonStyles = () => {
    const baseIntensity = variant === 'subtle' ? 0.5 : 1;
    const scrollEffect = scrollProgress * (variant === 'subtle' ? 0.6 : 1.2);
    const shadowIntensity = Math.max(baseIntensity - scrollEffect, 0);

    const subtleFactor = variant === 'subtle' ? 0.5 : 1;

    // Get theme directly from document instead of relying on context
    const isDark = document.documentElement.classList.contains('dark');
    
    // Light theme shadows
    const lightOuterShadow = `
      ${16 * shadowIntensity * subtleFactor}px ${16 * shadowIntensity * subtleFactor}px ${32 * shadowIntensity}px #d1d1d1,
      ${-16 * shadowIntensity * subtleFactor}px ${-16 * shadowIntensity * subtleFactor}px ${32 * shadowIntensity}px #ffffff,
      0 0 ${15 * shadowIntensity}px rgba(209, 209, 209, ${variant === 'subtle' ? '0.4' : '0.7'})
    `;
    
    const lightInsetShadow = `
      inset ${12 * subtleFactor}px ${12 * subtleFactor}px ${24 * subtleFactor}px #d1d1d1,
      inset ${-12 * subtleFactor}px ${-12 * subtleFactor}px ${24 * subtleFactor}px #ffffff,
      inset 0 0 ${15 * subtleFactor}px rgba(209, 209, 209, ${variant === 'subtle' ? '0.4' : '0.7'})
    `;

    // Dark theme shadows
    const darkOuterShadow = `
      ${16 * shadowIntensity * subtleFactor}px ${16 * shadowIntensity * subtleFactor}px ${32 * shadowIntensity}px #151515,
      ${-16 * shadowIntensity * subtleFactor}px ${-16 * shadowIntensity * subtleFactor}px ${32 * shadowIntensity}px #353535,
      0 0 ${15 * shadowIntensity}px rgba(21, 21, 21, ${variant === 'subtle' ? '0.4' : '0.7'})
    `;
    
    const darkInsetShadow = `
      inset ${12 * subtleFactor}px ${12 * subtleFactor}px ${24 * subtleFactor}px #151515,
      inset ${-12 * subtleFactor}px ${-12 * subtleFactor}px ${24 * subtleFactor}px #353535,
      inset 0 0 ${15 * subtleFactor}px rgba(21, 21, 21, ${variant === 'subtle' ? '0.4' : '0.7'})
    `;

    const shadow = isPressed 
      ? (isDark ? darkInsetShadow : lightInsetShadow)
      : (isDark ? darkOuterShadow : lightOuterShadow);

    return {
      transform: `scale(${buttonVisible ? (isPressed ? 0.98 : 1) : 0.95})`,
      boxShadow: buttonVisible ? shadow : 'none',
      opacity: 1, // Add this to ensure visibility
      transitionProperty: 'transform, box-shadow',
      transitionDuration: '200ms',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  const widthClasses = {
    default: 'w-[180px]',
    auto: 'w-auto',
    full: 'w-full'
  }[width];

  return (
    <div
      className={`${widthClasses} h-[50px] rounded-lg transform transition-all duration-1000 ease-out overflow-hidden`}
      style={getButtonStyles()}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      <button 
        type={type}
        className={`w-full h-full bg-gray-100 dark:bg-dark text-gray-700 dark:text-gray-200 
                   hover:shadow-neumorph-hover dark:hover:shadow-neumorph-dark-hover 
                   active:shadow-neumorph-inset dark:active:shadow-neumorph-dark-inset 
                   transition-shadow rounded-lg flex items-center justify-center gap-2
                   ${variant === 'subtle' ? 'bg-opacity-90' : ''}`}
        onClick={onClick}
      >
        {buttonVisible && (
          <div className={`flex items-center gap-2 transition-opacity duration-500
            ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
            {icon}
            <Typewriter
              text={text}
              delay={delay}
              className="block text-lg text-gray-600 dark:text-gray-300" 
            />
          </div>
        )}
      </button>
    </div>
  );
};

export default AnimatedButton;