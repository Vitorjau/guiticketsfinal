import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { AlertCircle } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import * as api from '../api/client';

interface RegisterPageProps {
  onRegister: (user: any) => void;
  onBackToLogin: () => void;
}

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
  const [loading, setLoading] = useState(false);
  const [agentCode, setAgentCode] = useState('');

  // Detecta automaticamente se é email de agente
  const isAgentEmail = email.trim().toLowerCase().endsWith('@agente.com');

  const handleNameChange = (value: string) => {
    // Permite apenas letras (maiúsculas, minúsculas, acentuadas) e espaços
    const filteredValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    setName(filteredValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    if (!validateName(name)) {
      setError('Nome inválido. Use apenas letras e espaços');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('E-mail inválido. Use o formato: usuario@dominio.com');
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      setLoading(false);
      return;
    }

    // Se é email @agente.com, deve obrigatoriamente ter código de agente
    if (isAgentEmail && !agentCode.trim()) {
      setError('Código de agente é obrigatório para emails @agente.com');
      setLoading(false);
      return;
    }

    // Call backend register
    try {
      const user = await api.register(name, email.trim().toLowerCase(), password, isAgentEmail ? agentCode.trim() : undefined);
      onRegister(user);
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar');
      setLoading(false);
    }
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
            <p className="text-xs text-[var(--app-text-tertiary)]">
              Deve conter: maiúsculas, minúsculas, números e caracteres especiais
            </p>
          </div>

          {/* Info box sobre tipo de conta */}
          {email && (
            <div className={`p-3 rounded-lg text-sm transition-all ${
              isAgentEmail
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
                : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
            }`}>
              <p className="font-medium mb-1">
                {isAgentEmail ? '👤 Será cadastrado como Agente' : '👥 Será cadastrado como Solicitante'}
              </p>
              <p className="text-xs opacity-90">
                {isAgentEmail 
                  ? 'Você terá acesso completo ao painel de agentes'
                  : 'Você pode criar e acompanhar seus chamados'}
              </p>
            </div>
          )}

          {/* Campo de código de agente - aparece apenas para emails @agente.com */}
          {isAgentEmail && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <Label htmlFor="agentCode" className="text-[var(--app-text-primary)]">Código de Agente *</Label>
              <Input
                id="agentCode"
                type="text"
                placeholder="Ex: AGENT-0001-XXXXXX"
                value={agentCode}
                onChange={(e) => setAgentCode(e.target.value.toUpperCase())}
                className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-tertiary)]"
                disabled={loading}
              />
              <p className="text-xs text-[var(--app-text-tertiary)]">
                Código único obrigatório para registro de agentes. Cada código pode ser usado apenas uma vez.
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-11 bg-[var(--app-blue-600)] hover:bg-[var(--app-blue-700)] text-white transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-sm text-[var(--app-blue-600)] hover:text-[var(--app-blue-700)] hover:underline disabled:opacity-50"
              disabled={loading}
            >
              Já tenho conta
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
RegisterPage.displayName = 'RegisterPage';