import { useState, useEffect } from 'react';
import { ClipboardList, Edit2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { Task } from '../App';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  mode: 'view' | 'edit';
  onSave?: (taskId: string, updates: { title: string; description: string; priority: Task['priority'] }) => void;
}

const priorityConfig = {
  low: { label: 'Baixa', color: 'text-blue-600 dark:text-blue-400' },
  medium: { label: 'Média', color: 'text-yellow-600 dark:text-yellow-400' },
  high: { label: 'Alta', color: 'text-red-600 dark:text-red-400' },
};

const statusConfig = {
  open: { label: 'Aberto' },
  'in-progress': { label: 'Em Atendimento' },
  waiting: { label: 'Aguardando' },
  completed: { label: 'Concluído' },
};

export function TaskDetailModal({ isOpen, onClose, task, mode, onSave }: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setIsEditing(mode === 'edit');
  }, [task, mode, isOpen]);

  const handleSave = () => {
    if (onSave && title.trim()) {
      onSave(task.id, { title, description, priority });
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">
                {isEditing ? 'Editar Tarefa' : 'Detalhes da Tarefa'}
              </DialogTitle>
            </div>
            {!isEditing && onSave && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-[var(--app-border)]"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
          <DialogDescription>
            <span className="font-mono text-xs">{task.id}</span>
            {' • '}
            <span className={priorityConfig[task.priority].color}>
              Prioridade {priorityConfig[task.priority].label}
            </span>
            {' • '}
            <span>{statusConfig[task.status].label}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título da tarefa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva os detalhes da tarefa"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as Task['priority'])}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Título</Label>
                <p className="text-[var(--app-text-primary)] font-medium">{task.title}</p>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <p className="text-[var(--app-text-secondary)] text-sm leading-relaxed">
                  {task.description || 'Sem descrição'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs text-[var(--app-text-tertiary)]">Criado em</Label>
                  <p className="text-sm text-[var(--app-text-secondary)]">{formatDate(task.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-[var(--app-text-tertiary)]">Atualizado em</Label>
                  <p className="text-sm text-[var(--app-text-secondary)]">{formatDate(task.updatedAt)}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  if (mode === 'edit') {
                    onClose();
                  } else {
                    setIsEditing(false);
                    setTitle(task.title);
                    setDescription(task.description);
                    setPriority(task.priority);
                  }
                }}
                className="border-[var(--app-border)]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Salvar Alterações
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[var(--app-border)]"
            >
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
