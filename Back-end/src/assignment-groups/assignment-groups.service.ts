import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentGroupDto } from './dto/create-assignment-group.dto';
import { UpdateAssignmentGroupDto } from './dto/update-assignment-group.dto';

@Injectable()
export class AssignmentGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAssignmentGroupDto) {
    const existing = await (this.prisma as any).assignmentGroup.findUnique({ where: { key: dto.key } });
    if (existing) throw new BadRequestException('Chave de grupo já existe');
    return (this.prisma as any).assignmentGroup.create({ data: dto });
  }

  findAll() {
    return (this.prisma as any).assignmentGroup.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const group = await (this.prisma as any).assignmentGroup.findUnique({ where: { id } });
    if (!group) throw new NotFoundException('Grupo não encontrado');
    return group;
  }

  async update(id: string, dto: UpdateAssignmentGroupDto) {
    await this.findOne(id);
    if (dto.key) {
      const existsKey = await (this.prisma as any).assignmentGroup.findUnique({ where: { key: dto.key } });
      if (existsKey && existsKey.id !== id) throw new BadRequestException('Chave de grupo já utilizada');
    }
    return (this.prisma as any).assignmentGroup.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return (this.prisma as any).assignmentGroup.delete({ where: { id } });
  }
}
