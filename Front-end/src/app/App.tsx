import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardLayout } from './components/DashboardLayout';
import { KanbanView } from './pages/KanbanView';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { AllTicketsPage } from './pages/AllTicketsPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { CreateTicketModal } from './components/CreateTicketModal';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import * as api from './api/client';

type Page = 'login' | 'register' | 'kanban' | 'my-tickets' | 'open-tickets' | 'in-progress-tickets' | 'waiting-tickets' | 'completed-tickets' | 'ticket-detail' | 'profile';
type UserRole = 'requester' | 'agent';

export interface AssignmentGroup {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'waiting' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  relatedSystem?: string;
  tags?: string[]; // Etiquetas
  assignmentGroup?: string; // ID do grupo de atribuição
  attachments?: {
    name: string;
    size: number;
    type: string;
    url: string; // Em produção seria a URL do servidor
  }[];
  author: string;
  authorEmail: string;
  assignedTo?: string; // Nome do agente atribuído
  assignedToEmail?: string; // Email do agente atribuído
  completedBy?: string; // Nome do agente que concluiu
  completedByEmail?: string; // Email do agente que concluiu
  createdAt: Date;
  updatedAt: Date;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  author: string;
  authorEmail: string;
  content: string;
  createdAt: Date;
  isAgent: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-say';
  phone?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'waiting' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  isTask: true; // Flag para diferenciar de tickets
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Grupos de atribuição padrão
  const [assignmentGroups] = useState<AssignmentGroup[]>([
    { id: 'suporte-ti', name: 'Suporte TI', color: '#3b82f6', description: 'Equipe de suporte técnico' },
    { id: 'infraestrutura', name: 'Infraestrutura', color: '#8b5cf6', description: 'Equipe de infraestrutura e redes' },
    { id: 'rh', name: 'Recursos Humanos', color: '#ec4899', description: 'Departamento de RH' },
    { id: 'financeiro', name: 'Financeiro', color: '#10b981', description: 'Departamento financeiro' },
    { id: 'geral', name: 'Geral', color: '#6b7280', description: 'Atendimento geral' },
  ]);

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TCK-001',
      title: 'Problema no acesso ao sistema',
      description: 'Não consigo fazer login com minhas credenciais. Quando tento acessar aparece mensagem de erro "Usuário ou senha inválidos" mesmo com as credenciais corretas.',
      status: 'open',
      author: 'João Silva',
      authorEmail: 'joao@empresa.com',
      createdAt: new Date('2025-12-21T10:00:00'),
      updatedAt: new Date('2025-12-21T10:00:00'),
      messages: []
    },
    {
      id: 'TCK-002',
      title: 'Solicitação de novo equipamento',
      description: 'Preciso de um novo notebook para trabalho. O atual está muito lento e travando constantemente.',
      status: 'in-progress',
      author: 'Maria Santos',
      authorEmail: 'maria@empresa.com',
      createdAt: new Date('2025-12-20T14:30:00'),
      updatedAt: new Date('2025-12-21T09:15:00'),
      messages: [
        {
          id: 'msg-1',
          author: 'Maria Santos',
          authorEmail: 'maria@empresa.com',
          content: 'Preciso de um novo notebook para trabalho',
          createdAt: new Date('2025-12-20T14:30:00'),
          isAgent: false
        },
        {
          id: 'msg-2',
          author: 'Suporte TI',
          authorEmail: 'suporte@agente.com',
          content: 'Olá Maria! Estamos analisando sua solicitação. Qual modelo você precisa e quais as configurações mínimas?',
          createdAt: new Date('2025-12-21T09:15:00'),
          isAgent: true
        }
      ]
    },
    {
      id: 'TCK-003',
      title: 'Dúvida sobre férias',
      description: 'Como solicitar minhas férias pelo sistema? Não encontrei onde fazer a solicitação.',
      status: 'waiting',
      author: 'Pedro Costa',
      authorEmail: 'pedro@empresa.com',
      createdAt: new Date('2025-12-19T11:20:00'),
      updatedAt: new Date('2025-12-21T08:00:00'),
      messages: [
        {
          id: 'msg-3',
          author: 'Pedro Costa',
          authorEmail: 'pedro@empresa.com',
          content: 'Como solicitar minhas férias pelo sistema?',
          createdAt: new Date('2025-12-19T11:20:00'),
          isAgent: false
        },
        {
          id: 'msg-4',
          author: 'RH',
          authorEmail: 'rh@agente.com',
          content: 'Olá Pedro! Para solicitar férias, acesse o menu RH > Férias. Você já tentou?',
          createdAt: new Date('2025-12-21T08:00:00'),
          isAgent: true
        }
      ]
    },
    {
      id: 'TCK-004',
      title: 'Instalação de software',
      description: 'Preciso do Photoshop instalado no meu computador para trabalhar com edição de imagens.',
      status: 'completed',
      author: 'Ana Lima',
      authorEmail: 'ana@empresa.com',
      createdAt: new Date('2025-12-18T16:00:00'),
      updatedAt: new Date('2025-12-19T10:30:00'),
      messages: [
        {
          id: 'msg-5',
          author: 'Suporte TI',
          authorEmail: 'suporte@agente.com',
          content: 'Software instalado com sucesso! Você já pode começar a usar.',
          createdAt: new Date('2025-12-19T10:30:00'),
          isAgent: true
        }
      ]
    },
    {
      id: 'TCK-005',
      title: 'Impressora não está funcionando',
      description: 'A impressora do 3º andar não está imprimindo. Já tentei reiniciar mas continua com problema.',
      status: 'open',
      author: 'Carlos Oliveira',
      authorEmail: 'carlos@empresa.com',
      createdAt: new Date('2025-12-21T09:30:00'),
      updatedAt: new Date('2025-12-21T09:30:00'),
      messages: []
    },
    {
      id: 'TCK-006',
      title: 'Acesso ao servidor de arquivos',
      description: 'Preciso de acesso ao servidor de arquivos compartilhados do departamento de marketing.',
      status: 'in-progress',
      author: 'Juliana Ferreira',
      authorEmail: 'juliana@empresa.com',
      createdAt: new Date('2025-12-20T15:45:00'),
      updatedAt: new Date('2025-12-21T08:20:00'),
      messages: [
        {
          id: 'msg-6',
          author: 'Suporte TI',
          authorEmail: 'suporte@agente.com',
          content: 'Olá Juliana! Preciso da aprovação do seu gestor para liberar o acesso. Você já solicitou?',
          createdAt: new Date('2025-12-21T08:20:00'),
          isAgent: true
        }
      ]
    }
  ]);

  // Fetch tickets from backend on mount (best-effort)
  useEffect(() => {
    (async () => {
      try {
        const backendTickets = await api.getTickets();
        if (backendTickets?.length) {
          setTickets(backendTickets as any);
        }
      } catch (e) {
        // silent fallback to local mocked tickets
      }
    })();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    // Normaliza o email (remove espaços e converte para lowercase)
    const normalizedEmail = email.trim().toLowerCase();
    
    // Mock login - Para demo, agente usa email com @agente.com
    if (password.length >= 3) {
      const role: UserRole = normalizedEmail.includes('@agente.com') ? 'agent' : 'requester';
      const name = normalizedEmail.split('@')[0];

      // Best-effort: ensure user exists in backend and use its id
      try {
        const beUser = await api.findOrCreateUser({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email: normalizedEmail,
          passwordHash: password, // demo only, server expects a hash field name
          role: role === 'agent' ? 'AGENT' : 'REQUESTER',
        });
        setCurrentUser({ id: beUser.id, name: beUser.name, email: beUser.email, role });
      } catch {
        setCurrentUser({ 
          id: `user-${normalizedEmail}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email: normalizedEmail, 
          role 
        });
      }

      // Redireciona baseado no perfil
      setCurrentPage(role === 'agent' ? 'kanban' : 'my-tickets');
      
      // Exibe mensagem de sucesso com toast
      setTimeout(() => {
        toast.success(
          role === 'agent' ? 'Login como Agente realizado!' : 'Login realizado com sucesso!',
          {
            description: role === 'agent' 
              ? `Bem-vindo ${name}! Acesso completo ao Kanban liberado.` 
              : `Bem-vindo ${name}! Você pode visualizar seus chamados.`
          }
        );
      }, 100);
    }
  };

  const handleRegister = async (name: string, email: string, password: string, role: UserRole) => {
    if (password.length > 0) {
      const normalizedEmail = email.trim().toLowerCase();
      try {
        const beUser = await api.findOrCreateUser({
          name,
          email: normalizedEmail,
          passwordHash: password,
          role: role === 'agent' ? 'AGENT' : 'REQUESTER',
        });
        setCurrentUser({ id: beUser.id, name: beUser.name, email: beUser.email, role });
      } catch {
        setCurrentUser({ id: `user-${normalizedEmail}`, name, email: normalizedEmail, role });
      }
      setCurrentPage(role === 'agent' ? 'kanban' : 'my-tickets');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleCreateTicket = async (data: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    relatedSystem?: string;
    tags: string[];
    attachments: File[];
  }) => {
    // Converte os arquivos File em objetos de anexo
    // Em produção, você faria upload para o servidor aqui
    const attachmentObjects = data.attachments.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file) // Em produção seria a URL do servidor
    }));

    // Atribui grupo automaticamente baseado no sistema relacionado
    let assignedGroupId = 'geral'; // Grupo padrão
    
    if (data.relatedSystem) {
      const systemToGroupMap: Record<string, string> = {
        'erp': 'suporte-ti',
        'crm': 'suporte-ti',
        'email': 'suporte-ti',
        'network': 'infraestrutura',
        'hardware': 'infraestrutura',
        'software': 'suporte-ti',
        'access': 'suporte-ti',
        'rh': 'rh',
        'financial': 'financeiro',
        'portal': 'suporte-ti',
        'printer': 'infraestrutura',
        'other': 'geral',
      };
      assignedGroupId = systemToGroupMap[data.relatedSystem] || 'geral';
    }

    const newId = `TCK-${String(tickets.length + 1).padStart(3, '0')}`;
    const newTicket: Ticket = {
      id: newId,
      title: data.title,
      description: data.description,
      status: 'open',
      priority: data.priority,
      relatedSystem: data.relatedSystem,
      tags: data.tags.length > 0 ? data.tags : undefined,
      assignmentGroup: assignedGroupId,
      attachments: attachmentObjects.length > 0 ? attachmentObjects : undefined,
      author: currentUser?.name || 'Usuário',
      authorEmail: currentUser?.email || 'user@empresa.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    };
    
    setTickets([newTicket, ...tickets]);
    setIsCreateModalOpen(false);
    
    // Mostra qual grupo foi atribuído
    const assignedGroup = assignmentGroups.find(g => g.id === assignedGroupId);
    if (assignedGroup) {
      setTimeout(() => {
        toast.success('Chamado criado e atribuído!', {
          description: `Grupo de atendimento: ${assignedGroup.name}`
        });
      }, 100);
    }

    // Best-effort send to backend
    try {
      if (currentUser) {
        await api.createTicket({
          id: newId,
          title: data.title,
          description: data.description,
          authorId: currentUser.id,
          priority: data.priority.toUpperCase() as any,
          relatedSystem: data.relatedSystem,
          assignmentGroupId: assignedGroupId,
        });
      }
    } catch {}
  };

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: Ticket['status']) => {
    const ticket = tickets.find(t => t.id === ticketId);
    
    // Notifica quando um chamado concluído é reaberto
    if (ticket && ticket.status === 'completed' && newStatus !== 'completed') {
      toast.success(`Chamado ${ticketId} foi reaberto!`, {
        description: 'O chamado foi movido de volta para atendimento.'
      });
    }

    // Marca quem concluiu o chamado
    const updates: Partial<Ticket> = { 
      status: newStatus, 
      updatedAt: new Date() 
    };
    
    if (newStatus === 'completed' && ticket && !ticket.completedBy) {
      updates.completedBy = currentUser?.name;
      updates.completedByEmail = currentUser?.email;
    }
    
    // optimistic update
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, ...updates }
        : ticket
    ));

    // attempt backend call
    try {
      await api.updateTicketStatus(ticketId, newStatus);
    } catch (e) {
      // revert if needed? keep optimistic for UX
    }
  };

  const handleAssignTicket = async (ticketId: string) => {
    if (!currentUser) return;

    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            status: 'in-progress',
            assignedTo: currentUser.name,
            assignedToEmail: currentUser.email,
            updatedAt: new Date() 
          }
        : ticket
    ));

    // backend attempt (best-effort, requires existing user in DB)
    try {
      await api.assignTicket(ticketId, currentUser.id);
    } catch {}

    toast.success(`Chamado ${ticketId} atribuído para você!`, {
      description: 'O chamado foi movido para Em Atendimento.'
    });
  };

  const handleReopenTicket = async (ticketId: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            status: 'open',
            assignedTo: undefined,
            assignedToEmail: undefined,
            completedBy: undefined,
            completedByEmail: undefined,
            updatedAt: new Date() 
          }
        : ticket
    ));

    try { await api.reopenTicket(ticketId); } catch {}

    toast.success(`Chamado ${ticketId} reaberto!`, {
      description: 'O chamado foi movido para Abertos.'
    });
  };

  const handleAddMessage = async (ticketId: string, content: string) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const newMessage: TicketMessage = {
          id: `msg-${Date.now()}`,
          author: currentUser?.name || 'Usuário',
          authorEmail: currentUser?.email || 'user@empresa.com',
          content,
          createdAt: new Date(),
          isAgent: false
        };
        return {
          ...ticket,
          messages: [...ticket.messages, newMessage],
          updatedAt: new Date()
        };
      }
      return ticket;
    }));

    try {
      await api.addMessage(ticketId, {
        content,
        authorId: currentUser?.id,
        authorName: currentUser?.name || 'Usuário',
        authorEmail: currentUser?.email || 'user@empresa.com',
        isAgent: currentUser?.role === 'agent'
      });
    } catch {}
  };

  const handleCreateTask = (taskData: {
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'waiting';
    priority?: 'low' | 'medium' | 'high';
  }) => {
    const newTask: Task = {
      id: `TASK-${String(tasks.length + 1).padStart(3, '0')}`,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      isTask: true
    };
    setTasks([newTask, ...tasks]);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date() }
        : task
    ));
  };

  const handleUpdateTask = (taskId: string, updates: { title: string; description: string; priority: Task['priority'] }) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
    toast.success('Tarefa atualizada com sucesso!');
  };

  const handleDeleteTicket = async (ticketId: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== ticketId));
    toast.success(`Chamado ${ticketId} excluído com sucesso!`);
    try { await api.deleteTicket(ticketId); } catch {}
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success(`Tarefa ${taskId} excluída com sucesso!`);
  };

  const handleViewTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setCurrentPage('ticket-detail');
  };

  const handleUpdateProfile = (updates: {
    name?: string;
    email?: string;
    password?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-say';
    phone?: string;
  }) => {
    if (!currentUser) return;
    
    // Atualiza o perfil do usuário
    setCurrentUser({
      ...currentUser,
      ...(updates.name && { name: updates.name }),
      ...(updates.email && { email: updates.email }),
      ...(updates.gender && { gender: updates.gender }),
      ...(updates.phone !== undefined && { phone: updates.phone }),
    });

    // Em um app real, aqui você faria uma chamada à API para atualizar a senha
    // Por enquanto, apenas simulamos a atualização
    if (updates.password) {
      console.log('Senha atualizada com sucesso (simulado)');
    }
  };

  if (!currentUser) {
    if (currentPage === 'register') {
      return (
        <ThemeProvider>
          <RegisterPage onRegister={handleRegister} onBackToLogin={() => setCurrentPage('login')} />
        </ThemeProvider>
      );
    }
    return (
      <ThemeProvider>
        <LoginPage onLogin={handleLogin} onGoToRegister={() => setCurrentPage('register')} />
      </ThemeProvider>
    );
  }

  const selectedTicket = selectedTicketId
    ? tickets.find(t => t.id === selectedTicketId)
    : null;

  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <DashboardLayout
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          currentUser={currentUser}
          onLogout={handleLogout}
          onCreateTicket={() => setIsCreateModalOpen(true)}
        >
          {currentPage === 'kanban' && currentUser.role === 'agent' && (
            <KanbanView
              tickets={tickets}
              tasks={tasks}
              onCreateTask={handleCreateTask}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onUpdateTask={handleUpdateTask}
              onDeleteTicket={handleDeleteTicket}
              onDeleteTask={handleDeleteTask}
              onViewTicket={handleViewTicket}
            />
          )}
          {currentPage === 'kanban' && currentUser.role === 'requester' && (
            <div className="h-full flex items-center justify-center bg-[var(--app-bg)]">
              <div className="text-center p-8 max-w-md">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-[var(--app-text-primary)] mb-2">Acesso Restrito</h2>
                <p className="text-[var(--app-text-secondary)] mb-6">Esta área é exclusiva para agentes. Você pode acompanhar seus chamados na área "Meus Chamados".</p>
              </div>
            </div>
          )}
          {currentPage === 'my-tickets' && (
            <MyTicketsPage
              tickets={currentUser.role === 'agent' ? tickets : tickets.filter(t => t.authorEmail === currentUser.email)}
              onViewTicket={handleViewTicket}
              currentUser={currentUser}
            />
          )}
          {currentPage === 'open-tickets' && (
            <AllTicketsPage
              tickets={tickets.filter(t => t.status === 'open')}
              allTickets={tickets}
              onViewTicket={handleViewTicket}
              onAssignTicket={handleAssignTicket}
              currentUser={currentUser}
              statusFilter="open"
              title="Chamados Abertos"
              description="Visualize todos os chamados que aguardam atendimento"
            />
          )}
          {currentPage === 'in-progress-tickets' && (
            <AllTicketsPage
              tickets={tickets.filter(t => t.status === 'in-progress')}
              allTickets={tickets}
              onViewTicket={handleViewTicket}
              onAssignTicket={handleAssignTicket}
              currentUser={currentUser}
              statusFilter="in-progress"
              title="Chamados em Atendimento"
              description="Acompanhe os chamados que estão sendo resolvidos"
            />
          )}
          {currentPage === 'waiting-tickets' && (
            <AllTicketsPage
              tickets={tickets.filter(t => t.status === 'waiting')}
              allTickets={tickets}
              onViewTicket={handleViewTicket}
              onAssignTicket={handleAssignTicket}
              currentUser={currentUser}
              statusFilter="waiting"
              title="Chamados Aguardando"
              description="Chamados aguardando resposta ou ação do usuário"
            />
          )}
          {currentPage === 'completed-tickets' && (
            <AllTicketsPage
              tickets={tickets.filter(t => t.status === 'completed')}
              allTickets={tickets}
              onViewTicket={handleViewTicket}
              onAssignTicket={handleAssignTicket}
              onReopenTicket={handleReopenTicket}
              currentUser={currentUser}
              statusFilter="completed"
              title="Chamados Concluídos"
              description="Histórico de chamados finalizados"
            />
          )}
          {currentPage === 'ticket-detail' && selectedTicket && (
            <TicketDetailPage
              ticket={selectedTicket}
              assignmentGroups={assignmentGroups}
              onAddMessage={handleAddMessage}
              onUpdateStatus={handleUpdateTicketStatus}
              onAssignTicket={handleAssignTicket}
              onBack={() => setCurrentPage(currentUser.role === 'agent' ? 'kanban' : 'my-tickets')}
              currentUser={currentUser}
            />
          )}
          {currentPage === 'profile' && (
            <ProfilePage
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </DashboardLayout>
        <Toaster />
        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateTicket={handleCreateTicket}
        />
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;