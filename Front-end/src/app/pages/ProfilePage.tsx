import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { AlertCircle, CheckCircle, User, Lock, Save } from 'lucide-react';
import * as api from '../api/client';

interface ProfilePageProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: 'requester' | 'agent';
    gender?: 'male' | 'female' | 'other' | 'prefer-not-say';
    phone?: string;
  };
  onUserUpdated?: (user: any) => void;
}

export function ProfilePage({ currentUser, onUserUpdated }: ProfilePageProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer-not-say'>(
    currentUser.gender || 'prefer-not-say'
  );
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoadingProfile(true);

    if (!name || !email) {
      setErrorMessage('Nome e e-mail são obrigatórios');
      setLoadingProfile(false);
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('E-mail inválido');
      setLoadingProfile(false);
      return;
    }

    try {
      const updatedUser = await api.updateProfile(currentUser.id, {
        name,
        email,
        gender,
        phone: phone || undefined,
      });
      setSuccessMessage('Perfil atualizado com sucesso!');
      onUserUpdated?.(updatedUser);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao atualizar perfil');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoadingPassword(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Preencha todos os campos de senha');
      setLoadingPassword(false);
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('A nova senha deve ter pelo menos 8 caracteres');
      setLoadingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas não coincidem');
      setLoadingPassword(false);
      return;
    }

    try {
      await api.changePassword(currentUser.id, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Senha alterada com sucesso! Faça login novamente com a nova senha.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao alterar senha');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--app-bg)]">
      {/* Header */}
      <div className="h-[88px] flex items-center bg-[var(--app-surface)] border-b border-[var(--app-border)] px-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--app-text-primary)] mb-1">Meu Perfil</h1>
          <p className="text-[var(--app-text-secondary)]">Gerencie suas informações pessoais e configurações</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 max-w-4xl">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-300">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Personal Information Card */}
        <Card className="p-6 mb-6 bg-[var(--app-surface)] border-[var(--app-border)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[var(--app-blue-100)] rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-[var(--app-blue-600)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--app-text-primary)]">Informações Pessoais</h2>
              <p className="text-sm text-[var(--app-text-secondary)]">Atualize seus dados básicos</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[var(--app-text-primary)]">
                  Nome Completo *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loadingProfile}
                  className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[var(--app-text-primary)]">
                  E-mail *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loadingProfile}
                  className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[var(--app-text-primary)]">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loadingProfile}
                  className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-[var(--app-text-primary)]">
                  Gênero
                </Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  disabled={loadingProfile}
                  className="h-11 w-full rounded-md border border-[var(--app-border)] bg-[var(--app-surface-hover)] px-3 text-[var(--app-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-blue-600)] focus:border-transparent"
                >
                  <option value="prefer-not-say">Prefiro não informar</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[var(--app-text-primary)]">
                Tipo de Conta
              </Label>
              <div className="flex items-center gap-2 h-11 px-3 rounded-md border border-[var(--app-border)] bg-[var(--app-surface-hover)]">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                  currentUser.role === 'agent' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}>
                  {currentUser.role === 'agent' ? 'Agente' : 'Usuário'}
                </span>
                <span className="text-sm text-[var(--app-text-secondary)]">
                  {currentUser.role === 'agent' ? 'Gerenciar chamados' : 'Abrir chamados'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleUpdateProfile}
                disabled={loadingProfile}
                className="bg-[var(--app-blue-600)] hover:bg-[var(--app-blue-700)] text-white disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loadingProfile ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Security Card */}
        <Card className="p-6 bg-[var(--app-surface)] border-[var(--app-border)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--app-text-primary)]">Segurança</h2>
              <p className="text-sm text-[var(--app-text-secondary)]">Altere sua senha de acesso</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-[var(--app-text-primary)]">
                Senha Atual *
              </Label>
                <Input
                id="current-password"
                type="password"
                placeholder="Digite sua senha atual"
                value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loadingPassword}
                className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-[var(--app-text-primary)]">
                  Nova Senha *
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loadingPassword}
                  className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-[var(--app-text-primary)]">
                  Confirmar Nova Senha *
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Digite novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loadingPassword}
                  className="h-11 bg-[var(--app-surface-hover)] border-[var(--app-border)] text-[var(--app-text-primary)]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleUpdatePassword}
                disabled={loadingPassword}
                className="bg-red-600 hover:bg-red-700 text-white border border-red-600 disabled:opacity-50"
              >
                <Lock className="w-4 h-4 mr-2" />
                {loadingPassword ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

ProfilePage.displayName = 'ProfilePage';