import pkg from '@prisma/client';
const { PrismaClient } = pkg as any;
const prisma = new PrismaClient();

function randomCodeSuffix(len = 6): string {
  return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
}

async function getMaxIndex(): Promise<number> {
  const all = await prisma.agentCode.findMany({ select: { code: true } });
  let max = 0;
  for (const { code } of all) {
    const m = code.match(/^AGENT-(\d{4})-/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!Number.isNaN(n) && n > max) max = n;
    }
  }
  return max;
}

async function main() {
  const COUNT = 50;
  const start = (await getMaxIndex()) + 1;
  const generated: string[] = [];

  for (let i = 0; i < COUNT; i++) {
    const idx = start + i;
    const code = `AGENT-${String(idx).padStart(4, '0')}-${randomCodeSuffix(6)}`;

    await prisma.agentCode.upsert({
      where: { code },
      update: {},
      create: { code, used: false },
    });
    generated.push(code);
  }

  console.log('NOVOS CODIGOS GERADOS:');
  for (const c of generated) console.log(c);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
