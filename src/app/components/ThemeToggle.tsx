import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function ThemeToggle({ variant = 'default', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg 
          bg-[var(--app-surface)] hover:bg-[var(--app-surface-hover)] 
          border border-[var(--app-border)] 
          text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]
          transition-all shadow-sm hover:shadow-md
          ${className}
        `}
        aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        title={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
        hover:bg-[var(--app-surface-hover)] transition-colors 
        text-[var(--app-text-secondary)]
        ${className}
      `}
      aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
      <span className="font-medium">
        {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
      </span>
    </button>
  );
}
