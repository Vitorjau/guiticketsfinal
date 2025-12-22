import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { AlertCircle, CheckCircle, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

interface RegisterPageProps {
  onRegister: (name: string, email: string, password: string, role: 'requester' | 'agent') => void;
  onBackToLogin: () => void;
}

// Códigos de convite válidos (mock - em produção viriam do backend)
const VALID_INVITE_CODES = ['AGENT2024', 'TEAMDEV', 'SUPPORT123'];

// Função de validação de nome (apenas letras e espaços)
const validateName = (name: string): boolean => {
  const regex = /^[a-zA-ZÀ-ÿ\s]+$/;
  return regex.test(name) && name.trim().length > 0;
};

// Função de validação de email
const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Função de validação de senha
const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'A senha deve ter pelo menos 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos um número' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos um caractere especial (!@#$%^&*...)' };
  }
  return { valid: true, message: 'Senha válida' };
};

export function RegisterPage({ onRegister, onBackToLogin }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Estados do código de convite
  const [showInviteField, setShowInviteField] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteCodeStatus, setInviteCodeStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const handleInviteCodeChange = (value: string) => {
    setInviteCode(value.toUpperCase());
    
    if (value.trim() === '') {
      setInviteCodeStatus('idle');
      return;
    }
    
    // Simula validação do código (em produção seria uma chamada ao backend)
    const isValid = VALID_INVITE_CODES.includes(value.toUpperCase().trim());
    setInviteCodeStatus(isValid ? 'valid' : 'invalid');
  };

  const handleNameChange = (value: string) => {
    // Permite apenas letras (maiúsculas, minúsculas, acentuadas) e espaços
    const filteredValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    setName(filteredValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!validateName(name)) {
      setError('Nome inválido. Use apenas letras e espaços');
      return;
    }

    if (!validateEmail(email)) {
      setError('E-mail inválido. Use o formato: usuario@dominio.com');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return;
    }

    // Se o campo de convite está visível mas o código é inválido
    if (showInviteField && inviteCode.trim() !== '' && inviteCodeStatus === 'invalid') {
      setError('Código de convite inválido. Remova-o ou use um código válido.');
      return;
    }

    // Define o role baseado no código de convite
    const role = inviteCodeStatus === 'valid' ? 'agent' : 'requester';
    
    onRegister(name, email, password, role);
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex items-center justify-center p-4 relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle variant="compact" />
      </div>

      <Card className="w-full max-w-md p-8 bg-[var(--app-surface)] border-[var(--app-border)] shadow-[var(--app-shadow-lg)]">
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center justify-center mb-8">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="var(--app-blue-600)"/>
              <path d="M20 10L12 16V28L20 34L28 28V16L20 10Z" fill="white"/>
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-[var(--app-text-primary)] mb-2">Criar Conta</h1>
          <p className="text-sm text-[var(--app-text-tertiary)] mb-1">A plataforma de chamados para o dog</p>
          <p className="text-[var(--app-text-secondary)]">Preencha os dados para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[var(--app-text-primary)]">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="João Silva"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-tertiary)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[var(--app-text-primary)]">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-tertiary)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[var(--app-text-primary)]">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres (Aa1!)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-tertiary)]"
            />
            <p className="text-xs text-[var(--app-text-tertiary)]">
              Deve conter: maiúsculas, minúsculas, números e caracteres especiais
            </p>
          </div>

          {/* Link para revelar campo de código de convite */}
          {!showInviteField && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowInviteField(true)}
                className="text-sm text-[var(--app-text-secondary)] hover:text-[var(--app-blue-600)] transition-colors flex items-center gap-1 group"
              >
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                É membro de uma equipe? Insira o código de convite
              </button>
            </div>
          )}

          {/* Campo de código de convite com animação */}
          {showInviteField && (
            <div 
              className="space-y-2 animate-in slide-in-from-top-2 duration-300"
              style={{
                animation: 'slideDown 0.3s ease-out'
              }}
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="inviteCode" className="text-[var(--app-text-primary)]">
                  Código de Convite da Equipe
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteField(false);
                    setInviteCode('');
                    setInviteCodeStatus('idle');
                  }}
                  className="text-xs text-[var(--app-text-tertiary)] hover:text-[var(--app-text-primary)] transition-colors"
                >
                  Remover
                </button>
              </div>
              
              <div className="relative">
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder="Ex: AGENT2024"
                  value={inviteCode}
                  onChange={(e) => handleInviteCodeChange(e.target.value)}
                  className={`h-11 pr-10 bg-[var(--app-surface-hover)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-tertiary)] transition-all ${
                    inviteCodeStatus === 'valid' 
                      ? 'border-green-500 dark:border-green-600 focus-visible:ring-green-500/20' 
                      : inviteCodeStatus === 'invalid'
                      ? 'border-red-500 dark:border-red-600 focus-visible:ring-red-500/20'
                      : 'border-[var(--app-border)]'
                  }`}
                />
                
                {/* Ícone de status */}
                {inviteCodeStatus === 'valid' && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-in zoom-in duration-200">
                    <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                  </div>
                )}
                
                {inviteCodeStatus === 'invalid' && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-in zoom-in duration-200">
                    <div className="w-5 h-5 bg-red-500 dark:bg-red-600 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Mensagem de feedback */}
              {inviteCodeStatus === 'valid' && (
                <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-in slide-in-from-top-1 duration-200">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                      Código válido
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">
                      Seu perfil será de Agente com acesso completo ao sistema
                    </p>
                  </div>
                </div>
              )}

              {inviteCodeStatus === 'invalid' && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                      Código de convite inválido
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                      Verifique o código com o administrador da sua equipe
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-11 bg-[var(--app-blue-600)] hover:bg-[var(--app-blue-700)] text-white transition-all"
          >
            {inviteCodeStatus === 'valid' ? 'Criar Conta de Agente' : 'Criar Conta'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-sm text-[var(--app-blue-600)] hover:text-[var(--app-blue-700)] hover:underline"
            >
              Já tenho conta
            </button>
          </div>
        </form>
      </Card>

      {/* CSS para animação de slide down */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
RegisterPage.displayName = 'RegisterPage';