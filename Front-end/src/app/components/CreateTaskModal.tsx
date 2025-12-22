import { useState } from 'react';
import { ClipboardList, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: {
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'waiting';
    priority?: 'low' | 'medium' | 'high';
  }) => void;
}

export function CreateTaskModal({ isOpen, onClose, onCreateTask }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'open' | 'in-progress' | 'waiting'>('open');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('O título da tarefa é obrigatório');
      return;
    }

    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      status,
      priority
    });

    // Reset form
    setTitle('');
    setDescription('');
    setStatus('open');
    setPriority('medium');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStatus('open');
    setPriority('medium');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-[var(--app-surface)] border-[var(--app-border)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <ClipboardList className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <DialogTitle className="text-[var(--app-text-primary)]">
                  Nova Tarefa Interna
                </DialogTitle>
                <DialogDescription className="text-[var(--app-text-tertiary)] text-xs mt-0.5">
                  Organize suas atividades internas no Kanban
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-[var(--app-text-primary)]">
              Título da Tarefa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="Ex: Revisar documentação técnica"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              className="bg-[var(--app-bg)] border-[var(--app-border)] text-[var(--app-text-primary)] focus:border-[var(--app-blue-600)]"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="task-description" className="text-[var(--app-text-primary)]">
              Descrição <span className="text-[var(--app-text-tertiary)] text-xs font-normal">(Opcional)</span>
            </Label>
            <Textarea
              id="task-description"
              placeholder="Descreva os detalhes da tarefa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-[var(--app-bg)] border-[var(--app-border)] text-[var(--app-text-primary)] focus:border-[var(--app-blue-600)] resize-none"
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="task-status" className="text-[var(--app-text-primary)]">
                Coluna Inicial
              </Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger className="bg-[var(--app-bg)] border-[var(--app-border)] text-[var(--app-text-primary)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--app-surface)] border-[var(--app-border)]">
                  <SelectItem value="open">Aberto</SelectItem>
                  <SelectItem value="in-progress">Em Atendimento</SelectItem>
                  <SelectItem value="waiting">Aguardando</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="task-priority" className="text-[var(--app-text-primary)]">
                Prioridade
              </Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger className="bg-[var(--app-bg)] border-[var(--app-border)] text-[var(--app-text-primary)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--app-surface)] border-[var(--app-border)]">
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Baixa</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span>Média</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span>Alta</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
            <p className="text-xs text-[var(--app-text-secondary)]">
              💡 <strong className="text-[var(--app-text-primary)]">Dica:</strong> Tarefas internas são ideais para organizar atividades que não dependem de chamados externos, como revisões, reuniões ou processos internos.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-[var(--app-border)] hover:bg-[var(--app-surface-hover)]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Criar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
