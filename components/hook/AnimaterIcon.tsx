import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface AnimatedNeumorphicIconProps {
  Icon: LucideIcon;
  delay?: number;
  className?: string;
  isVisible?: boolean;
  href: string;
}

const AnimatedNeumorphicIcon: React.FC<AnimatedNeumorphicIconProps> = ({ 
  Icon, 
  delay = 0, 
  className = "",
  isVisible = false,
  href
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, isVisible]);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    window.open(href, '_blank');
  };

  return (
    <div 
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        transition-all duration-700 ease-out 
        cursor-pointer 
        ${className} 
        ${isAnimated 
          ? "p-4 rounded-lg" 
          : "p-2 rounded-lg opacity-50 scale-90 bg-gray-200/30 dark:bg-dark/30"
        }
        ${isPressed 
          ? "shadow-neumorph-inset dark:shadow-neumorph-dark-inset" 
          : "shadow-neumorph dark:shadow-neumorph-dark hover:shadow-neumorph-hover dark:hover:shadow-neumorph-dark-hover"
        }
      `}
      style={{
        transformOrigin: 'center',
      }}
    >
      <Icon 
        className={`transition-all duration-500 ease-out ${
          isAnimated 
            ? "text-gray-600 dark:text-gray-300" 
            : "text-gray-400 dark:text-gray-600 opacity-70"
        }`}
        size={24}
      />
    </div>
  );
};

export default AnimatedNeumorphicIcon;