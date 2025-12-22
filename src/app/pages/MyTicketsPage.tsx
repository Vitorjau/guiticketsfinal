import { useState } from 'react';
import { Clock, Search, Filter, Inbox } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import type { Ticket } from '../App';
import type { User as UserType } from '../App';

interface MyTicketsPageProps {
  tickets: Ticket[];
  onViewTicket: (ticketId: string) => void;
  currentUser: UserType | null;
}

const statusConfig = {
  open: { label: 'Aberto', variant: 'default' as const },
  'in-progress': { label: 'Em Atendimento', variant: 'secondary' as const },
  waiting: { label: 'Aguardando', variant: 'outline' as const },
  completed: { label: 'Concluído', variant: 'secondary' as const },
};

export function MyTicketsPage({ tickets, onViewTicket, currentUser }: MyTicketsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Proteção contra currentUser undefined
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
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in-progress').length,
    waiting: tickets.filter((t) => t.status === 'waiting').length,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-[88px] flex items-center bg-[var(--app-surface)] border-b border-[var(--app-border)] px-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--app-text-primary)] mb-1">
            Meus Chamados
          </h1>
          <p className="text-[var(--app-text-secondary)]">
            Acompanhe todos os seus chamados abertos
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--app-surface)] border-b border-[var(--app-border)] px-8 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--app-text-tertiary)]" />
            <Input
              placeholder="Buscar chamados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--app-text-secondary)]" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="in-progress">Em Atendimento</SelectItem>
                <SelectItem value="waiting">Aguardando</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="flex-1 overflow-auto p-8">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-20 h-20 bg-[var(--app-blue-50)] rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-10 h-10 text-[var(--app-blue-600)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--app-text-primary)] mb-2">
              Você ainda não abriu nenhum chamado
            </h3>
            <p className="text-[var(--app-text-secondary)] text-center max-w-md">
              Crie seu primeiro chamado para começar a receber suporte da nossa equipe.
            </p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-[var(--app-border)] rounded-lg">
            <div className="w-16 h-16 bg-[var(--app-surface-hover)] rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-[var(--app-text-tertiary)]" />
            </div>
            <p className="text-lg font-medium text-[var(--app-text-primary)] mb-1">Nenhum chamado encontrado</p>
            <p className="text-[var(--app-text-secondary)]">Tente ajustar os filtros ou buscar por outro termo</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const config = statusConfig[ticket.status];
              return (
                <div
                  key={ticket.id}
                  onClick={() => onViewTicket(ticket.id)}
                  className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg p-5 hover:shadow-[var(--app-shadow-md)] transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-[var(--app-text-secondary)] bg-[var(--app-surface-hover)] px-2.5 py-1 rounded">
                          {ticket.id}
                        </span>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      <h3 className="font-medium text-[var(--app-text-primary)] mb-2">{ticket.title}</h3>
                      <p className="text-sm text-[var(--app-text-secondary)] line-clamp-2">{ticket.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--app-border)]">
                    <div className="flex items-center gap-2 text-sm text-[var(--app-text-secondary)]">
                      <Clock className="w-4 h-4" />
                      <span>Criado em {formatDate(ticket.createdAt)}</span>
                    </div>
                    {ticket.messages.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-[var(--app-text-secondary)]">
                        <span>{ticket.messages.length} {ticket.messages.length === 1 ? 'resposta' : 'respostas'}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

MyTicketsPage.displayName = 'MyTicketsPage';