import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface CreateTaskWarningModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onContinue: () => void;
}

export function CreateTaskWarningModal({ isOpen, onCancel, onContinue }: CreateTaskWarningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px] bg-[var(--app-surface)] border-[var(--app-border)]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-500" />
            </div>
            <DialogTitle className="text-[var(--app-text-primary)]">
              Criar Tarefa Personalizada
            </DialogTitle>
          </div>
          <DialogDescription className="text-[var(--app-text-secondary)] pt-2">
            Você está criando uma nova tarefa que <strong className="text-[var(--app-text-primary)]">não está associada a nenhum chamado</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-[var(--app-text-secondary)]">
              Essa tarefa será usada apenas para <strong className="text-[var(--app-text-primary)]">organização interna</strong> no Kanban e:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--app-text-secondary)] list-disc list-inside">
              <li>Não terá um número de chamado (ID)</li>
              <li>Não aparecerá para usuários solicitantes</li>
              <li>Não enviará notificações externas</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-[var(--app-border)] hover:bg-[var(--app-surface-hover)]"
          >
            Cancelar
          </Button>
          <Button
            onClick={onContinue}
            className="bg-[var(--app-blue-600)] hover:bg-[var(--app-blue-700)] text-white"
          >
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
