import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { AlertCircle, Info, ShieldCheck, User } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import * as api from '../api/client';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onGoToRegister: () => void;
}

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

export function LoginPage({ onLogin, onGoToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = email.trim().includes('@') && email.trim().length > 3;
  const isAgent = email.trim().toLowerCase().includes('@agente.com');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validações
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
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

    // Call backend login
    try {
      const user = await api.login(email.trim().toLowerCase(), password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
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
          <h1 className="text-3xl font-semibold text-[var(--app-text-primary)] mb-2">GuiTickets</h1>
          <p className="text-sm text-[var(--app-text-tertiary)] mb-1">A plataforma de chamados para o dog</p>
          <p className="text-[var(--app-text-secondary)]">Faça login para continuar</p>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-3 bg-[var(--app-blue-50)] border border-[var(--app-border)] rounded-lg">
          <div className="flex items-start gap-2 text-sm text-[var(--app-blue-700)]">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Dica para teste:</p>
              <p className="text-xs opacity-90">
                <strong>Agente:</strong> Use email terminando com @agente.com<br />
                <strong>Exemplo:</strong> suporte@agente.com<br />
                <strong>Usuário:</strong> Qualquer outro email válido
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Indicador de tipo de login */}
          {isValidEmail && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-all ${
              isAgent 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
            }`}>
              {isAgent ? (
                <>
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Login como Agente</strong> - Acesso completo ao Kanban</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Login como Usuário</strong> - Acesso aos seus chamados</span>
                </>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[var(--app-text-primary)]">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com ou suporte@agente.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-tertiary)]"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[var(--app-text-primary)]">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-tertiary)]"
              autoComplete="current-password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-[var(--app-blue-600)] hover:bg-[var(--app-blue-700)] text-white"
            disabled={!email || !password || password.length < 8 || loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onGoToRegister}
              className="text-sm text-[var(--app-blue-600)] hover:text-[var(--app-blue-700)] hover:underline"
            >
              Criar conta
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
LoginPage.displayName = 'LoginPage';