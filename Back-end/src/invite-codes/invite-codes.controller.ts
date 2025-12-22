import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('invite-codes')
export class InviteCodesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':code')
  async validate(@Param('code') code: string) {
    const c = await (this.prisma as any).agentCode.findUnique({ where: { code } });
    return {
      code,
      exists: !!c,
      valid: !!c && !c.used,
      used: !!c && !!c.used,
      usedBy: c?.usedBy ?? null,
    };
  }
}
