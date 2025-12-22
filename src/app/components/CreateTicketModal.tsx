import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { toast } from 'sonner';
import { Upload, X, FileText, Paperclip, Tag as TagIcon } from 'lucide-react';
import { Badge } from './ui/badge';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTicket: (data: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    relatedSystem?: string;
    tags: string[];
    attachments: File[];
  }) => void;
}

export function CreateTicketModal({ isOpen, onClose, onCreateTicket }: CreateTicketModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [relatedSystem, setRelatedSystem] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const SUPPORTED_FORMATS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.png', '.jpg', '.jpeg', '.gif'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Por favor, preencha o título do chamado');
      return;
    }

    if (!description.trim()) {
      toast.error('Por favor, preencha a descrição do chamado');
      return;
    }

    onCreateTicket({
      title,
      description,
      priority,
      relatedSystem: relatedSystem || undefined,
      tags,
      attachments
    });
    
    handleClose();
    toast.success('Chamado criado com sucesso!');
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setRelatedSystem('');
    setTags([]);
    setAttachments([]);
    onClose();
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      // Verifica tamanho
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} excede o tamanho máximo de 10MB`);
        return;
      }

      // Verifica formato
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!SUPPORTED_FORMATS.includes(extension)) {
        errors.push(`${file.name} não é um formato suportado`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length > 0) {
      setAttachments(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} arquivo(s) adicionado(s)`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const files: File[] = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        if (file) files.push(file);
      }
    }

    if (files.length > 0) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      handleFileSelect(dataTransfer.files);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    toast.success('Arquivo removido');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
    toast.success('Tag removida');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-[var(--app-surface)] border-[var(--app-border)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--app-text-primary)]">Abrir Novo Chamado</DialogTitle>
          <DialogDescription className="text-[var(--app-text-secondary)]">
            Descreva seu problema ou solicitação. Nossa equipe irá atendê-lo em breve.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4" onPaste={handlePaste}>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[var(--app-text-primary)]">Título do Chamado *</Label>
            <Input
              id="title"
              placeholder="Ex: Problema no acesso ao sistema"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-tertiary)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[var(--app-text-primary)]">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Descreva detalhadamente seu problema ou solicitação..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="resize-none bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-tertiary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-[var(--app-text-primary)]">Prioridade *</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)]">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Baixa
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Média
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      Alta
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      Urgente
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="system" className="text-[var(--app-text-primary)]">Sistema Relacionado (opcional)</Label>
              <Select value={relatedSystem} onValueChange={setRelatedSystem}>
                <SelectTrigger className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)]">
                  <SelectValue placeholder="Selecione o sistema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="erp">ERP</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="network">Rede/Internet</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="portal">Portal Corporativo</SelectItem>
                  <SelectItem value="printer">Impressoras</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Área de Upload de Arquivos */}
          <div className="space-y-2">
            <Label className="text-[var(--app-text-primary)]">Anexos (opcional)</Label>
            
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                isDragging
                  ? 'border-[var(--app-blue-500)] bg-[var(--app-blue-50)]'
                  : 'border-[var(--app-border)] bg-[var(--app-surface-hover)]'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                accept={SUPPORTED_FORMATS.join(',')}
              />

              <div className="text-center">
                <Upload className="w-10 h-10 mx-auto mb-3 text-[var(--app-text-tertiary)]" />
                <p className="text-sm text-[var(--app-text-primary)] mb-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[var(--app-blue-600)] hover:text-[var(--app-blue-700)] font-medium"
                  >
                    Clique para selecionar
                  </button>
                  {' '}ou arraste arquivos aqui
                </p>
                <p className="text-xs text-[var(--app-text-tertiary)] mt-2">
                  Você também pode colar (Ctrl+V) capturas de tela
                </p>
                <p className="text-xs text-[var(--app-text-tertiary)] mt-3">
                  <strong>Formatos suportados:</strong> PDF, DOC, DOCX, XLS, XLSX, TXT, PNG, JPG, GIF
                  <br />
                  <strong>Tamanho máximo:</strong> 10MB por arquivo
                </p>
              </div>
            </div>

            {/* Lista de arquivos anexados */}
            {attachments.length > 0 && (
              <div className="space-y-2 mt-3">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-[var(--app-blue-100)] rounded flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <FileText className="w-4 h-4 text-[var(--app-blue-600)]" />
                      ) : (
                        <Paperclip className="w-4 h-4 text-[var(--app-blue-600)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--app-text-primary)] truncate">{file.name}</p>
                      <p className="text-xs text-[var(--app-text-tertiary)]">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Área de Tags */}
          <div className="space-y-2">
            <Label className="text-[var(--app-text-primary)]">Tags (opcional)</Label>
            <div className="flex items-center gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                placeholder="Adicione uma tag"
                className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-tertiary)]"
              />
              <Button
                type="button"
                onClick={handleTagAdd}
                className="bg-[var(--app-blue-600)] hover:bg-[var(--app-blue-700)] text-white"
              >
                Adicionar
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 bg-[var(--app-blue-100)] text-[var(--app-blue-700)] dark:bg-[var(--app-blue-900)] dark:text-[var(--app-blue-300)] px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--app-blue-200)] dark:border-[var(--app-blue-800)]"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 hover:bg-[var(--app-blue-200)] dark:hover:bg-[var(--app-blue-800)] rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-[var(--app-border)]">
            <Button type="button" variant="outline" onClick={handleClose} className="border-[var(--app-border)] text-[var(--app-text-primary)] hover:bg-[var(--app-surface-hover)]">
              Cancelar
            </Button>
            <Button type="submit" className="bg-[var(--app-blue-600)] hover:bg-[var(--app-blue-700)] text-white">
              Enviar Chamado
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
CreateTicketModal.displayName = 'CreateTicketModal';