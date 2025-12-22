import { ReactNode } from 'react';
import { LayoutDashboard, Ticket, Plus, Settings, LogOut, User, Shield, ListTodo, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ThemeToggle } from './ThemeToggle';
import type { User as UserType } from '../App';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: 'kanban' | 'my-tickets' | 'open-tickets' | 'in-progress-tickets' | 'waiting-tickets' | 'completed-tickets' | 'profile') => void;
  currentUser: UserType | null;
  onLogout: () => void;
  onCreateTicket?: () => void;
}

export function DashboardLayout({ 
  children, 
  currentPage, 
  onNavigate, 
  currentUser,
  onLogout,
  onCreateTicket
}: DashboardLayoutProps) {
  // Proteção contra currentUser undefined
  if (!currentUser) {
    return null;
  }

  // Menu items COMPLETAMENTE DIFERENTES baseado no perfil
  const requesterMenuItems = [
    { id: 'my-tickets', label: 'Meus Chamados', icon: Ticket },
  ];

  const agentMenuItems = [
    { id: 'kanban', label: 'Kanban', icon: LayoutDashboard },
    { id: 'open-tickets', label: 'Chamados Abertos', icon: ListTodo },
    { id: 'in-progress-tickets', label: 'Em Atendimento', icon: Clock },
    { id: 'waiting-tickets', label: 'Aguardando', icon: AlertCircle },
    { id: 'completed-tickets', label: 'Concluídos', icon: CheckCircle2 },
  ];

  const menuItems = currentUser.role === 'agent' ? agentMenuItems : requesterMenuItems;

  return (
    <div className="flex h-screen bg-[var(--app-bg)] dark:bg-[var(--app-bg)]">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--app-surface)] border-r border-[var(--app-border)] flex flex-col">
        {/* Logo */}
        <div className="h-[88px] flex items-center px-6 border-b border-[var(--app-border)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="font-semibold text-[var(--app-text-primary)]">GuiTickets</h1>
              <p className="text-xs text-[var(--app-text-tertiary)]">
                {currentUser.role === 'agent' ? 'Área do Agente' : 'Portal do Usuário'}
              </p>
            </div>
          </div>
        </div>

        {/* Botão Criar Chamado - APENAS para Solicitantes */}
        {currentUser.role === 'requester' && onCreateTicket && (
          <div className="p-4 border-b border-[var(--app-border)]">
            <Button 
              onClick={onCreateTicket}
              className="w-full bg-[var(--app-blue-600)] hover:bg-[var(--app-blue-700)] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Chamado
            </Button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-[var(--app-blue-50)] text-[var(--app-blue-700)] dark:bg-[var(--app-blue-50)] dark:text-[var(--app-blue-600)]' 
                    : 'text-[var(--app-text-secondary)] hover:bg-[var(--app-surface-hover)]'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle & User Profile */}
        <div className="p-4 border-t border-[var(--app-border)] space-y-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--app-surface-hover)] transition-colors">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentUser.role === 'agent' ? 'bg-green-100 dark:bg-green-900' : 'bg-slate-200 dark:bg-slate-700'
                }`}>
                  {currentUser.role === 'agent' ? (
                    <Shield className="w-4 h-4 text-green-700 dark:text-green-300" />
                  ) : (
                    <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-[var(--app-text-primary)] truncate">{currentUser.name}</p>
                  <p className="text-xs text-[var(--app-text-tertiary)] truncate">
                    {currentUser.role === 'agent' ? 'Agente' : 'Usuário'}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-xs font-normal text-[var(--app-text-tertiary)] mt-1">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate('profile')}>
                <User className="w-4 h-4 mr-2" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

DashboardLayout.displayName = 'DashboardLayout';