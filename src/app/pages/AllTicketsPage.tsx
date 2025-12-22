import { useState, MouseEvent } from 'react';
import { Clock, User, Search, Inbox, Eye, UserPlus, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ContextMenu } from '../components/ContextMenu';
import type { ContextMenuItem } from '../components/ContextMenu';
import type { Ticket } from '../App';
import type { User as UserType } from '../App';

interface AllTicketsPageProps {
  tickets: Ticket[];
  onViewTicket: (ticketId: string) => void;
  onAssignTicket: (ticketId: string) => void;
  currentUser: UserType | null;
  statusFilter?: 'open' | 'in-progress' | 'completed' | 'all';
  title: string;
  description: string;
}

const statusConfig = {
  open: { label: 'Aberto', variant: 'default' as const, color: 'bg-blue-50 text-blue-700' },
  'in-progress': { label: 'Em Atendimento', variant: 'secondary' as const, color: 'bg-yellow-50 text-yellow-700' },
  waiting: { label: 'Aguardando', variant: 'outline' as const, color: 'bg-purple-50 text-purple-700' },
  completed: { label: 'Concluído', variant: 'secondary' as const, color: 'bg-green-50 text-green-700' },
};

export function AllTicketsPage({ 
  tickets, 
  onViewTicket, 
  onAssignTicket,
  currentUser,
  statusFilter = 'all',
  title,
  description
}: AllTicketsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);

  if (!currentUser) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleContextMenu = (e: MouseEvent, ticket: Ticket) => {
    e.preventDefault();
    e.stopPropagation();

    const items: ContextMenuItem[] = [
      {
        label: 'Visualizar chamado',
        icon: Eye,
        onClick: () => {
          onViewTicket(ticket.id);
        },
      },
    ];

    // Adiciona opção de atribuir apenas se for chamado aberto e agente
    if (ticket.status === 'open' && currentUser.role === 'agent') {
      items.push({
        label: 'Atribuir para mim',
        icon: UserPlus,
        onClick: () => {
          onAssignTicket(ticket.id);
        },
      });
    }

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-[88px] flex items-center bg-[var(--app-surface)] border-b border-[var(--app-border)] px-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--app-text-primary)] mb-1">
            {title}
          </h1>
          <p className="text-[var(--app-text-secondary)]">
            {description}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[var(--app-surface)] border-b border-[var(--app-border)] px-8 py-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm text-[var(--app-text-secondary)]">
              {tickets.filter(t => t.status === 'open').length} Abertos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-[var(--app-text-secondary)]">
              {tickets.filter(t => t.status === 'in-progress').length} Em Atendimento
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-sm text-[var(--app-text-secondary)]">
              {tickets.filter(t => t.status === 'waiting').length} Aguardando
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-[var(--app-text-secondary)]">
              {tickets.filter(t => t.status === 'completed').length} Concluídos
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[var(--app-surface)] border-b border-[var(--app-border)] px-8 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--app-text-tertiary)]" />
          <Input
            placeholder="Buscar por título, código ou solicitante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="flex-1 overflow-auto p-8">
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-20 h-20 bg-[var(--app-surface-hover)] rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-10 h-10 text-[var(--app-text-tertiary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--app-text-primary)] mb-2">
              {searchTerm ? 'Nenhum chamado encontrado' : 'Nenhum chamado neste status'}
            </h3>
            <p className="text-[var(--app-text-secondary)] text-center max-w-md">
              {searchTerm 
                ? 'Tente ajustar sua busca ou limpar o filtro'
                : 'Quando houver chamados neste status, eles aparecerão aqui'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const config = statusConfig[ticket.status];
              return (
                <div
                  key={ticket.id}
                  onClick={() => onViewTicket(ticket.id)}
                  onContextMenu={(e) => handleContextMenu(e, ticket)}
                  className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg p-5 hover:shadow-[var(--app-shadow-md)] hover:border-[var(--app-blue-600)] transition-all cursor-pointer group"
                  title="Clique para ver detalhes | Clique direito para mais opções"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-[var(--app-text-secondary)] bg-[var(--app-surface-hover)] px-2.5 py-1 rounded">
                          {ticket.id}
                        </span>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      <h3 className="font-medium text-[var(--app-text-primary)] mb-2 group-hover:text-[var(--app-blue-600)] transition-colors">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-[var(--app-text-secondary)] line-clamp-2 mb-3">{ticket.description}</p>
                      
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 text-sm text-[var(--app-text-secondary)]">
                          <User className="w-4 h-4" />
                          <span>{ticket.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--app-text-secondary)]">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(ticket.createdAt)}</span>
                        </div>
                        {ticket.messages.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-[var(--app-text-secondary)]">
                            <span className="font-medium">{ticket.messages.length}</span>
                            <span>{ticket.messages.length === 1 ? 'resposta' : 'respostas'}</span>
                          </div>
                        )}
                        
                        {/* Agente atribuído (Em Atendimento) */}
                        {ticket.status === 'in-progress' && ticket.assignedTo && (
                          <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 px-2 py-1 rounded-md border border-yellow-200 dark:border-yellow-700">
                            <User className="w-3.5 h-3.5" />
                            <span className="font-medium">Em atendimento por: {ticket.assignedTo}</span>
                          </div>
                        )}
                        
                        {/* Agente que concluiu (Concluído) */}
                        {ticket.status === 'completed' && ticket.completedBy && (
                          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-md border border-green-200 dark:border-green-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="font-medium">Concluído por: {ticket.completedBy}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

AllTicketsPage.displayName = 'AllTicketsPage';
