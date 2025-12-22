import pkg from '@prisma/client';
const { PrismaClient } = pkg as any;
const prisma = new PrismaClient();

// Generate 10 random agent codes
function generateAgentCodes(count: number): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(`AGENT-${String(i + 1).padStart(4, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  }
  return codes;
}

async function main() {
  // Generate agent codes
  const agentCodes = generateAgentCodes(10);

  // Seed agent codes
  for (const code of agentCodes) {
    await prisma.agentCode.upsert({
      where: { code },
      update: {},
      create: { code, used: false },
    });
  }

  console.log('Agent codes created:', agentCodes);

  // Users
  const agent = await prisma.user.upsert({
    where: { email: 'suporte@agente.com' },
    update: {},
    create: {
      name: 'Suporte TI',
      email: 'suporte@agente.com',
      passwordHash: 'demo',
      role: 'AGENT',
    },
  });

  const requester = await prisma.user.upsert({
    where: { email: 'joao@empresa.com' },
    update: {},
    create: { name: 'João Silva', email: 'joao@empresa.com', passwordHash: 'demo', role: 'REQUESTER' },
  });

  // Groups
  const ti = await prisma.assignmentGroup.upsert({
    where: { key: 'suporte-ti' },
    update: {},
    create: { key: 'suporte-ti', name: 'Suporte TI', color: '#3b82f6', description: 'Equipe de suporte técnico' },
  });

  // Default groups
  const defaultGroups = [
    { key: 'infraestrutura', name: 'Infraestrutura', color: '#0ea5e9' },
    { key: 'rh', name: 'RH', color: '#22c55e' },
    { key: 'financeiro', name: 'Financeiro', color: '#f59e0b' },
    { key: 'geral', name: 'Geral', color: '#64748b' },
  ];
  for (const g of defaultGroups) {
    await prisma.assignmentGroup.upsert({ where: { key: g.key }, update: {}, create: { ...g } });
  }

  // Tickets
  await prisma.ticket.upsert({
    where: { id: 'TCK-001' },
    update: {},
    create: {
      id: 'TCK-001',
      title: 'Problema no acesso ao sistema',
      description: 'Não consigo fazer login com minhas credenciais.',
      status: 'OPEN',
      authorId: requester.id,
      assignmentGroupId: ti.id,
    },
  });

  await prisma.ticket.upsert({
    where: { id: 'TCK-002' },
    update: {},
    create: {
      id: 'TCK-002',
      title: 'Solicitação de novo equipamento',
      description: 'Preciso de um novo notebook.',
      status: 'IN_PROGRESS',
      authorId: requester.id,
      assignedToId: agent.id,
      assignmentGroupId: ti.id,
    },
  });

  // Seed tasks
  await prisma.task.upsert({
    where: { id: 'TASK-001' },
    update: {},
    create: { id: 'TASK-001', title: 'Configurar backup diário', status: 'TODO', priority: 'MEDIUM' },
  });
  await prisma.task.upsert({
    where: { id: 'TASK-002' },
    update: {},
    create: { id: 'TASK-002', title: 'Atualizar antivírus em estações', status: 'IN_PROGRESS', priority: 'HIGH' },
  });
  await prisma.task.upsert({
    where: { id: 'TASK-003' },
    update: {},
    create: { id: 'TASK-003', title: 'Documentar padrão de senhas', status: 'DONE', priority: 'LOW' },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

