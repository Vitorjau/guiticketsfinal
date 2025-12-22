export type BackendTicket = {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | null;
  relatedSystem?: string | null;
  author: { id: string; name: string; email: string };
  assignedTo?: { id: string; name: string; email: string } | null;
  completedBy?: { id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
};

export type FrontendTicket = {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'waiting' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  relatedSystem?: string;
  author: string;
  authorEmail: string;
  assignedTo?: string;
  assignedToEmail?: string;
  completedBy?: string;
  completedByEmail?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: any[];
};

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

const mapStatusToFE = (s: BackendTicket['status']): FrontendTicket['status'] => {
  switch (s) {
    case 'OPEN': return 'open';
    case 'IN_PROGRESS': return 'in-progress';
    case 'WAITING': return 'waiting';
    case 'COMPLETED': return 'completed';
    default: return 'open';
  }
};

export const mapTicketToFE = (t: BackendTicket): FrontendTicket => ({
  id: t.id,
  title: t.title,
  description: t.description,
  status: mapStatusToFE(t.status),
  priority: t.priority ? t.priority.toLowerCase() as any : undefined,
  relatedSystem: t.relatedSystem ?? undefined,
  author: t.author?.name || 'Usuário',
  authorEmail: (t as any).author?.email || 'user@empresa.com',
  assignedTo: t.assignedTo?.name || undefined,
  assignedToEmail: (t as any).assignedTo?.email || undefined,
  completedBy: t.completedBy?.name || undefined,
  completedByEmail: (t as any).completedBy?.email || undefined,
  createdAt: new Date(t.createdAt),
  updatedAt: new Date(t.updatedAt),
  messages: [],
});

export async function getTickets(): Promise<FrontendTicket[]> {
  const res = await fetch(`${BASE_URL}/tickets`);
  if (!res.ok) throw new Error('Failed to fetch tickets');
  const data = await res.json();
  return (data as BackendTicket[]).map(mapTicketToFE);
}

// Users
export async function findOrCreateUser(payload: { name: string; email: string; passwordHash: string; role: 'REQUESTER' | 'AGENT' }) {
  const res = await fetch(`${BASE_URL}/users/find-or-create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to upsert user');
  return await res.json();
}

// Auth endpoints (new)
export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Email ou senha inválidos');
  }
  return await res.json();
}

export async function register(name: string, email: string, password: string, agentCode?: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, agentCode })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao registrar');
  }
  return await res.json();
}

// Tickets CRUD
export async function createTicket(payload: { id: string; title: string; description: string; authorId: string; priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'; relatedSystem?: string; assignmentGroupId?: string; }) {
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create ticket');
  return mapTicketToFE(await res.json());
}

export async function deleteTicket(id: string) {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete ticket');
}

export async function assignTicket(id: string, userId: string) {
  const res = await fetch(`${BASE_URL}/tickets/${id}/assign/${userId}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to assign');
  return mapTicketToFE(await res.json());
}

export async function reopenTicket(id: string) {
  const res = await fetch(`${BASE_URL}/tickets/${id}/reopen`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reopen');
  return mapTicketToFE(await res.json());
}

export async function updateTicketStatus(id: string, status: FrontendTicket['status']) {
  const map: Record<FrontendTicket['status'], BackendTicket['status']> = {
    'open': 'OPEN',
    'in-progress': 'IN_PROGRESS',
    'waiting': 'WAITING',
    'completed': 'COMPLETED',
  };
  const res = await fetch(`${BASE_URL}/tickets/${id}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: map[status] }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return mapTicketToFE(await res.json());
}

export async function addMessage(id: string, payload: { content: string; authorId?: string; authorName: string; authorEmail: string; isAgent?: boolean; }) {
  const res = await fetch(`${BASE_URL}/tickets/${id}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to add message');
  return await res.json();
}

// Profile endpoints
export async function updateProfile(userId: string, payload: { name?: string; email?: string; phone?: string; gender?: string }) {
  const res = await fetch(`${BASE_URL}/users/${userId}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao atualizar perfil');
  }
  return await res.json();
}

export async function changePassword(userId: string, payload: { currentPassword: string; newPassword: string; confirmPassword: string }) {
  const res = await fetch(`${BASE_URL}/users/${userId}/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao alterar senha');
  }
  return await res.json();
}
