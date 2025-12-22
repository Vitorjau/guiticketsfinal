import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: LoginDto) {
    // Find user by email
    const user = await (this.prisma as any).user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Email ou senha inválidos');

    // Compare password (demo: simple string match; in production use bcrypt)
    if (user.passwordHash !== dto.password) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return user;
  }

  async register(dto: RegisterDto) {
    // Check if email already exists
    const existing = await (this.prisma as any).user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email já cadastrado');

    // Determine role based on email domain and agent code
    const isAgentEmail = dto.email.toLowerCase().endsWith('@agente.com');
    let role = 'REQUESTER';

    if (dto.agentCode) {
      // Only emails @agente.com can use agent code
      if (!isAgentEmail) {
        throw new BadRequestException('Apenas emails @agente.com podem usar código de agente');
      }

      const agentCode = await (this.prisma as any).agentCode.findUnique({ where: { code: dto.agentCode } });
      if (!agentCode) throw new BadRequestException('Código de agente inválido');
      if (agentCode.used) throw new BadRequestException('Código de agente já foi utilizado');
      role = 'AGENT';
      // Mark code as used
      await (this.prisma as any).agentCode.update({
        where: { code: dto.agentCode },
        data: { used: true, usedBy: 'pending' } // will update with user id after creation
      });
    } else if (isAgentEmail) {
      // Emails @agente.com without code should be marked as AGENT anyway (or require code)
      // For now, we require agent emails to provide a code
      throw new BadRequestException('Emails @agente.com devem fornecer um código de agente válido');
    }

    // Create user
    const user = await (this.prisma as any).user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash: dto.password,
        role
      }
    });

    // Update agentCode with userId if it was used
    if (dto.agentCode) {
      await (this.prisma as any).agentCode.update({
        where: { code: dto.agentCode },
        data: { usedBy: user.id }
      });
    }

    return user;
  }
}
