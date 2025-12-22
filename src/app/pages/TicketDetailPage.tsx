import { useState } from 'react';
import { ArrowLeft, Clock, User, Send, MoreVertical, AlertCircle, Download, FileText, Paperclip, Flag, Server, Users, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { Ticket, AssignmentGroup } from '../App';
import type { User as UserType } from '../App';

interface TicketDetailPageProps {
  ticket: Ticket;
  assignmentGroups: AssignmentGroup[];
  onAddMessage: (ticketId: string, content: string) => void;
  onUpdateStatus: (ticketId: string, status: Ticket['status']) => void;
  onBack: () => void;
  currentUser: UserType | null;
}

const statusConfig = {
  open: { label: 'Aberto', variant: 'default' as const },
  'in-progress': { label: 'Em Atendimento', variant: 'secondary' as const },
  waiting: { label: 'Aguardando Usuário', variant: 'outline' as const },
  completed: { label: 'Concluído', variant: 'secondary' as const },
};

export function TicketDetailPage({ ticket, assignmentGroups, onAddMessage, onUpdateStatus, onBack, currentUser }: TicketDetailPageProps) {
  const [newMessage, setNewMessage] = useState('');

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

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Por favor, escreva uma mensagem');
      return;
    }

    onAddMessage(ticket.id, newMessage);
    setNewMessage('');
    toast.success('Resposta enviada com sucesso!');
  };

  const handleChangeStatus = (newStatus: Ticket['status']) => {
    onUpdateStatus(ticket.id, newStatus);
    toast.success('Status atualizado com sucesso!');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const config = statusConfig[ticket.status];

  const priorityConfig = {
    low: { label: 'Baixa', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    medium: { label: 'Média', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    high: { label: 'Alta', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
    urgent: { label: 'Urgente', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  };

  const systemNames: Record<string, string> = {
    erp: 'ERP',
    crm: 'CRM',
    email: 'E-mail',
    network: 'Rede/Internet',
    hardware: 'Hardware',
    software: 'Software',
    access: 'Controle de Acesso',
    rh: 'Recursos Humanos',
    financial: 'Financeiro',
    portal: 'Portal Corporativo',
    printer: 'Impressoras',
    phone: 'Telefonia',
    other: 'Outro',
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownloadAttachment = (url: string, name: string) => {
    // Em produção, isso seria um link real do servidor
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    toast.success(`Download de ${name} iniciado`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-[88px] flex items-center bg-[var(--app-surface)] border-b border-[var(--app-border)] px-8">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] hover:bg-[var(--app-surface-hover)]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[var(--app-text-secondary)] bg-[var(--app-surface-hover)] px-2.5 py-1 rounded">
                {ticket.id}
              </span>
              <Badge variant={config.variant}>{config.label}</Badge>
              <h1 className="text-xl font-semibold text-[var(--app-text-primary)] truncate">{ticket.title}</h1>
            </div>
          </div>
          {currentUser.role === 'agent' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[var(--app-border)] text-[var(--app-text-primary)] hover:bg-[var(--app-surface-hover)]">
                  <MoreVertical className="w-4 h-4 mr-2" />
                  Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[var(--app-surface)] border-[var(--app-border)]">
                <DropdownMenuItem onClick={() => handleChangeStatus('open')} className="text-[var(--app-text-primary)] hover:bg-[var(--app-surface-hover)]">
                  Marcar como Aberto
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChangeStatus('in-progress')} className="text-[var(--app-text-primary)] hover:bg-[var(--app-surface-hover)]">
                  Marcar como Em Atendimento
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChangeStatus('waiting')} className="text-[var(--app-text-primary)] hover:bg-[var(--app-surface-hover)]">
                  Marcar como Aguardando Usuário
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChangeStatus('completed')} className="text-[var(--app-text-primary)] hover:bg-[var(--app-surface-hover)]">
                  Marcar como Concluído
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8 bg-[var(--app-bg)]">
        <div className="max-w-7xl mx-auto flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Original Description */}
            <div className="bg-[var(--app-surface)] rounded-lg border border-[var(--app-border)] p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {getInitials(ticket.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-[var(--app-text-primary)]">{ticket.author}</span>
                    <span className="text-sm text-[var(--app-text-secondary)]">{formatDate(ticket.createdAt)}</span>
                  </div>
                  <p className="text-[var(--app-text-primary)] whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>
            </div>

            {/* Messages Timeline */}
            {ticket.messages.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[var(--app-border)]" />
                  <span className="text-sm text-[var(--app-text-secondary)]">Respostas</span>
                  <div className="h-px flex-1 bg-[var(--app-border)]" />
                </div>

                {ticket.messages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-[var(--app-surface)] rounded-lg border border-[var(--app-border)] p-6"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback
                          className={
                            message.isAgent
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          }
                        >
                          {getInitials(message.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-[var(--app-text-primary)]">{message.author}</span>
                          {message.isAgent && (
                            <Badge variant="secondary" className="text-xs">
                              Agente
                            </Badge>
                          )}
                          <span className="text-sm text-[var(--app-text-secondary)]">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-[var(--app-text-primary)] whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Box */}
            {ticket.status !== 'completed' && (
              <div className="bg-[var(--app-surface)] rounded-lg border border-[var(--app-border)] p-6">
                <h3 className="font-medium text-[var(--app-text-primary)] mb-4">Adicionar Resposta</h3>
                <Textarea
                  placeholder="Escreva sua resposta..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  className="mb-4 resize-none bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-tertiary)]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSendMessage}
                    className="bg-[var(--app-blue-600)] hover:bg-[var(--app-blue-700)] text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Resposta
                  </Button>
                </div>
              </div>
            )}

            {ticket.status === 'completed' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                <p className="text-green-800 dark:text-green-300 font-medium">Este chamado foi concluído</p>
                <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                  {currentUser.role === 'agent' 
                    ? 'Caso precise reabrir, use o menu de ações acima'
                    : 'Se precisar de mais ajuda, abra um novo chamado'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Priority */}
            {ticket.priority && (
              <div className="bg-[var(--app-surface)] rounded-lg border border-[var(--app-border)] p-6">
                <h3 className="flex items-center gap-2 font-medium text-[var(--app-text-primary)] mb-4">
                  <Flag className="w-4 h-4" />
                  Prioridade
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    ticket.priority === 'low' ? 'bg-green-500' :
                    ticket.priority === 'medium' ? 'bg-yellow-500' :
                    ticket.priority === 'high' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`} />
                  <span className={`font-medium ${priorityConfig[ticket.priority].color}`}>
                    {priorityConfig[ticket.priority].label}
                  </span>
                </div>
              </div>
            )}

            {/* System */}
            {ticket.relatedSystem && (
              <div className="bg-[var(--app-surface)] rounded-lg border border-[var(--app-border)] p-6">
                <h3 className="flex items-center gap-2 font-medium text-[var(--app-text-primary)] mb-4">
                  <Server className="w-4 h-4" />
                  Sistema Relacionado
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[var(--app-text-primary)]">
                    {systemNames[ticket.relatedSystem] || ticket.relatedSystem}
                  </Badge>
                </div>
              </div>
            )}

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="bg-[var(--app-surface)] rounded-lg border border-[var(--app-border)] p-6">
                <h3 className="flex items-center gap-2 font-medium text-[var(--app-text-primary)] mb-4">
                  <Paperclip className="w-4 h-4" />
                  Anexos ({ticket.attachments.length})
                </h3>
                <div className="space-y-2">
                  {ticket.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-[var(--app-surface-hover)] border border-[var(--app-border)] rounded-lg group hover:bg-[var(--app-bg)] transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-[var(--app-blue-100)] rounded flex items-center justify-center">
                        {attachment.type.startsWith('image/') ? (
                          <FileText className="w-4 h-4 text-[var(--app-blue-600)]" />
                        ) : (
                          <Paperclip className="w-4 h-4 text-[var(--app-blue-600)]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--app-text-primary)] truncate font-medium">{attachment.name}</p>
                        <p className="text-xs text-[var(--app-text-tertiary)]">{formatFileSize(attachment.size)}</p>
                      </div>
                      <button
                        onClick={() => handleDownloadAttachment(attachment.url, attachment.name)}
                        className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-[var(--app-blue-600)] hover:bg-[var(--app-blue-100)] dark:hover:bg-[var(--app-blue-900)] transition-colors opacity-0 group-hover:opacity-100"
                        title="Baixar arquivo"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="bg-[var(--app-surface)] rounded-lg border border-[var(--app-border)] p-6">
                <h3 className="flex items-center gap-2 font-medium text-[var(--app-text-primary)] mb-4">
                  <Tag className="w-4 h-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ticket.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-[var(--app-blue-50)] text-[var(--app-blue-700)] border-[var(--app-blue-200)]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Assignment Group */}
            {ticket.assignmentGroup && (
              <div className="bg-[var(--app-surface)] rounded-lg border border-[var(--app-border)] p-6">
                <h3 className="flex items-center gap-2 font-medium text-[var(--app-text-primary)] mb-4">
                  <Users className="w-4 h-4" />
                  Grupo de Atribuição
                </h3>
                {(() => {
                  const group = assignmentGroups.find(g => g.id === ticket.assignmentGroup);
                  return group ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: group.color }}
                        />
                        <span className="font-medium text-[var(--app-text-primary)]">{group.name}</span>
                      </div>
                      {group.description && (
                        <p className="text-xs text-[var(--app-text-secondary)] mt-1">{group.description}</p>
                      )}
                      {currentUser.role === 'requester' && (
                        <p className="text-xs text-[var(--app-text-tertiary)] mt-2 italic">
                          Este grupo foi atribuído automaticamente baseado no tipo de solicitação
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--app-text-secondary)]">Grupo não encontrado</p>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

TicketDetailPage.displayName = 'TicketDetailPage';