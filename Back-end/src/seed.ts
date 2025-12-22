import pkg from '@prisma/client';
const { PrismaClient } = pkg as any;
const prisma = new PrismaClient();

async function main() {
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

  console.log('Seed completed');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
