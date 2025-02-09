import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from './themeContexts';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg shadow-neumorph dark:shadow-neumorph-dark hover:shadow-neumorph-hover dark:hover:shadow-neumorph-dark-hover active:shadow-neumorph-inset dark:active:shadow-neumorph-dark-inset transition-shadow"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon size={20} className="text-gray-600 dark:text-gray-300" />
      ) : (
        <SunIcon size={20} className="text-gray-600 dark:text-gray-300" />
      )}
    </button>
  );
};

export default ThemeToggle;