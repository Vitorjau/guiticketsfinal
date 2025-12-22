import { useDrag, useDrop } from 'react-dnd';
import { Clock, User, ClipboardList, Eye, Trash2, Edit, CheckCircle2 } from 'lucide-react';
import { useState, MouseEvent } from 'react';
import type { Ticket, Task } from '../App';
import { Button } from '../components/ui/button';
import { CreateTaskWarningModal } from '../components/CreateTaskWarningModal';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { ContextMenu, ContextMenuItem } from '../components/ContextMenu';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { TaskDetailModal } from '../components/TaskDetailModal';

interface KanbanViewProps {
  tickets: Ticket[];
  tasks: Task[];
  onCreateTask: (taskData: {
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'waiting';
    priority?: 'low' | 'medium' | 'high';
  }) => void;
  onUpdateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
  onUpdateTask: (taskId: string, updates: { title: string; description: string; priority: Task['priority'] }) => void;
  onDeleteTicket: (ticketId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onViewTicket: (ticketId: string) => void;
}

const statusConfig = {
  open: { label: 'Aberto', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'in-progress': { label: 'Em Atendimento', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  waiting: { label: 'Aguardando Usuário', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  completed: { label: 'Concluído', color: 'bg-green-100 text-green-700 border-green-200' },
};

interface TicketCardProps {
  ticket: Ticket;
  onViewTicket: (ticketId: string) => void;
  onContextMenu: (e: MouseEvent, ticketId: string) => void;
}

function TicketCard({ ticket, onViewTicket, onContextMenu }: TicketCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TICKET',
    item: { id: ticket.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, ticket.id);
  };

  const handleClick = () => {
    onViewTicket(ticket.id);
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`
        bg-[var(--app-surface)] rounded-lg border border-[var(--app-border)] p-4
        hover:shadow-[var(--app-shadow-md)] transition-shadow cursor-move
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
      title="Arraste para mudar o status | Clique direito para opções"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-medium text-[var(--app-text-primary)] line-clamp-2">{ticket.title}</h3>
        <span className="text-xs font-medium text-[var(--app-text-secondary)] bg-[var(--app-surface-hover)] px-2 py-1 rounded flex-shrink-0">
          {ticket.id}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-[var(--app-text-secondary)] mb-2">
        <User className="w-3 h-3" />
        <span className="truncate">{ticket.author}</span>
      </div>

      {/* Agente atribuído - Em Atendimento */}
      {ticket.status === 'in-progress' && ticket.assignedTo && (
        <div className="flex items-center gap-1.5 text-xs text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 px-2 py-1 rounded mb-2 border border-yellow-200 dark:border-yellow-800">
          <User className="w-3 h-3" />
          <span className="truncate font-medium">{ticket.assignedTo}</span>
        </div>
      )}

      {/* Agente que concluiu - Concluído */}
      {ticket.status === 'completed' && ticket.completedBy && (
        <div className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded mb-2 border border-green-200 dark:border-green-800">
          <CheckCircle2 className="w-3 h-3" />
          <span className="truncate font-medium">{ticket.completedBy}</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-[var(--app-text-secondary)]">
        <Clock className="w-3 h-3" />
        <span>{formatDate(ticket.createdAt)}</span>
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onContextMenu: (e: MouseEvent, taskId: string) => void;
}

function TaskCard({ task, onContextMenu }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-amber-500',
    high: 'bg-red-500'
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, task.id);
  };

  return (
    <div
      ref={drag}
      onContextMenu={handleContextMenu}
      className={`
        bg-[var(--app-surface)] rounded-lg border-2 border-purple-200 dark:border-purple-700 p-4
        hover:shadow-[var(--app-shadow-md)] transition-shadow cursor-move
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
      title="Arraste para mudar o status | Clique direito para opções"
    >
      {/* Badge Tarefa Interna */}
      <div className="flex items-center gap-2 mb-2">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700">
          <ClipboardList className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Tarefa Interna</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} title={`Prioridade: ${task.priority}`}></div>
      </div>

      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-medium text-[var(--app-text-primary)] line-clamp-2">{task.title}</h3>
      </div>
      
      {task.description && (
        <p className="text-xs text-[var(--app-text-secondary)] line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-[var(--app-text-tertiary)]">
        <Clock className="w-3 h-3" />
        <span>{formatDate(task.createdAt)}</span>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  status: Ticket['status'];
  tickets: Ticket[];
  tasks: Task[];
  onUpdateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
  onViewTicket: (ticketId: string) => void;
  onTicketContextMenu: (e: MouseEvent, ticketId: string) => void;
  onTaskContextMenu: (e: MouseEvent, taskId: string) => void;
}

function KanbanColumn({ status, tickets, tasks, onUpdateTicketStatus, onUpdateTaskStatus, onViewTicket, onTicketContextMenu, onTaskContextMenu }: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ['TICKET', 'TASK'],
    drop: (item: { id: string }, monitor) => {
      const itemType = monitor.getItemType();
      if (itemType === 'TICKET') {
        onUpdateTicketStatus(item.id, status);
      } else if (itemType === 'TASK') {
        onUpdateTaskStatus(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const config = statusConfig[status];
  const totalItems = tickets.length + tasks.length;

  return (
    <div className="flex-1 min-w-[280px]">
      <div className="mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.color} dark:bg-opacity-20`}>
          <span className="font-medium">{config.label}</span>
          <span className="text-sm">({totalItems})</span>
        </div>
      </div>

      <div
        ref={drop}
        className={`
          space-y-3 min-h-[200px] p-2 rounded-lg transition-colors
          ${isOver ? 'bg-[var(--app-blue-50)] ring-2 ring-[var(--app-blue-600)]' : 'bg-transparent'}
        `}
      >
        {totalItems === 0 ? (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-[var(--app-border)] rounded-lg">
            <p className="text-sm text-[var(--app-text-tertiary)]">Nenhum item</p>
          </div>
        ) : (
          <>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onContextMenu={onTaskContextMenu} />
            ))}
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} onViewTicket={onViewTicket} onContextMenu={onTicketContextMenu} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export function KanbanView({ tickets, tasks, onCreateTask, onUpdateTicketStatus, onUpdateTaskStatus, onUpdateTask, onDeleteTicket, onDeleteTask, onViewTicket }: KanbanViewProps) {
  const columns: Ticket['status'][] = ['open', 'in-progress', 'waiting', 'completed'];

  const [isCreateTaskWarningModalOpen, setIsCreateTaskWarningModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [taskDetailMode, setTaskDetailMode] = useState<'view' | 'edit'>('view');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'ticket' | 'task' | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);

  const handleTicketContextMenu = (e: MouseEvent, ticketId: string) => {
    const items: ContextMenuItem[] = [
      {
        label: 'Visualizar chamado',
        icon: Eye,
        onClick: () => {
          onViewTicket(ticketId);
        },
      },
      {
        label: 'Excluir chamado',
        icon: Trash2,
        variant: 'danger',
        onClick: () => {
          setSelectedItemId(ticketId);
          setSelectedItemType('ticket');
          setIsDeleteConfirmationModalOpen(true);
        },
      },
    ];

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items,
    });
  };

  const handleTaskContextMenu = (e: MouseEvent, taskId: string) => {
    const items: ContextMenuItem[] = [
      {
        label: 'Visualizar tarefa',
        icon: Eye,
        onClick: () => {
          setSelectedItemId(taskId);
          setTaskDetailMode('view');
          setIsTaskDetailModalOpen(true);
        },
      },
      {
        label: 'Editar tarefa',
        icon: Edit,
        onClick: () => {
          setSelectedItemId(taskId);
          setTaskDetailMode('edit');
          setIsTaskDetailModalOpen(true);
        },
      },
      {
        label: 'Excluir tarefa',
        icon: Trash2,
        variant: 'danger',
        onClick: () => {
          setSelectedItemId(taskId);
          setSelectedItemType('task');
          setIsDeleteConfirmationModalOpen(true);
        },
      },
    ];

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items,
    });
  };

  const handleDeleteConfirm = () => {
    if (selectedItemId && selectedItemType) {
      if (selectedItemType === 'ticket') {
        onDeleteTicket(selectedItemId);
      } else {
        onDeleteTask(selectedItemId);
      }
    }
    setIsDeleteConfirmationModalOpen(false);
    setSelectedItemId(null);
    setSelectedItemType(null);
  };

  const selectedTask = selectedItemId ? tasks.find(t => t.id === selectedItemId) : null;
  const selectedTicket = selectedItemId ? tickets.find(t => t.id === selectedItemId) : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-[88px] flex items-center bg-[var(--app-surface)] border-b border-[var(--app-border)] px-8">
        <div className="flex items-center justify-between flex-1">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--app-text-primary)] mb-1">Kanban</h1>
            <p className="text-[var(--app-text-secondary)]">Gerencie todos os chamados em um quadro visual</p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsCreateTaskWarningModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white border-0"
          >
            <ClipboardList className="w-4 h-4" />
            Adicionar Tarefa
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-8 bg-[var(--app-bg)]">
        <div className="flex gap-6 min-w-max h-full">
          {columns.map((status, index) => (
            <div key={status} className="contents">
              <KanbanColumn
                status={status}
                tickets={tickets.filter((t) => t.status === status)}
                tasks={tasks.filter((t) => t.status === status)}
                onUpdateTicketStatus={onUpdateTicketStatus}
                onUpdateTaskStatus={onUpdateTaskStatus}
                onViewTicket={onViewTicket}
                onTicketContextMenu={handleTicketContextMenu}
                onTaskContextMenu={handleTaskContextMenu}
              />
              {index < columns.length - 1 && (
                <div 
                  className="self-stretch w-px bg-slate-200 dark:bg-slate-700"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
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

      {/* Modals */}
      <CreateTaskWarningModal
        isOpen={isCreateTaskWarningModalOpen}
        onCancel={() => setIsCreateTaskWarningModalOpen(false)}
        onContinue={() => {
          setIsCreateTaskWarningModalOpen(false);
          setIsCreateTaskModalOpen(true);
        }}
      />
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onCreateTask={onCreateTask}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => {
          setIsDeleteConfirmationModalOpen(false);
          setSelectedItemId(null);
          setSelectedItemType(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={selectedItemType === 'ticket' ? 'Excluir Chamado' : 'Excluir Tarefa'}
        description={
          selectedItemType === 'ticket'
            ? 'Tem certeza que deseja excluir este chamado? Esta ação não pode ser desfeita.'
            : 'Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.'
        }
        itemId={selectedItemId || ''}
      />
      {selectedTask && (
        <TaskDetailModal
          isOpen={isTaskDetailModalOpen}
          onClose={() => {
            setIsTaskDetailModalOpen(false);
            setSelectedItemId(null);
          }}
          task={selectedTask}
          mode={taskDetailMode}
          onSave={onUpdateTask}
        />
      )}
    </div>
  );
}