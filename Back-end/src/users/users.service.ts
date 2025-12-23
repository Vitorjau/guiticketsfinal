import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUserDto) {
    return this.prisma.user.create({ data: dto });
  }

  findAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findByEmail(email: string) {
    return (this.prisma as any).user.findUnique({ where: { email } });
  }

  async findOrCreate(dto: CreateUserDto) {
    const existing = await (this.prisma as any).user.findUnique({ where: { email: dto.email } });
    if (existing) return existing;
    return this.create(dto);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.findOne(id);
    
    // Check if new email is already in use by another user
    if (dto.email && dto.email !== user.email) {
      const existing = await (this.prisma as any).user.findUnique({ where: { email: dto.email } });
      if (existing) throw new BadRequestException('Email já cadastrado');
    }

    const updated = await this.prisma.user.update({ 
      where: { id }, 
      data: {
        name: dto.name || user.name,
        email: dto.email || user.email,
        phone: dto.phone,
        gender: dto.gender,
        updatedAt: new Date()
      } 
    });

    // Normalize role to lowercase for frontend compatibility
    return {
      ...updated,
      role: updated.role.toLowerCase()
    };
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.findOne(id);

    // Validate current password
    if (user.passwordHash !== dto.currentPassword) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Validate new password matches confirmation
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Senhas não conferem');
    }

    // Validate new password is different from current
    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException('Nova senha deve ser diferente da senha atual');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { 
        passwordHash: dto.newPassword,
        updatedAt: new Date()
      }
    });

    // Normalize role to lowercase for frontend compatibility
    return {
      ...updated,
      role: updated.role.toLowerCase()
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
