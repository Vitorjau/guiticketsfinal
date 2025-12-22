import { useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ContextMenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Pequeno delay para evitar que o click que abre o menu também o feche
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 0);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    // Ajusta a posição do menu para não sair da tela
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 8;
      }

      if (rect.bottom > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 8;
      }

      menuRef.current.style.left = `${adjustedX}px`;
      menuRef.current.style.top = `${adjustedY}px`;
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg shadow-[var(--app-shadow-lg)] py-1"
      style={{ left: x, top: y }}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        const isDanger = item.variant === 'danger';
        
        return (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
              transition-colors
              ${isDanger 
                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30' 
                : 'text-[var(--app-text-primary)] hover:bg-[var(--app-surface-hover)]'
              }
            `}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
