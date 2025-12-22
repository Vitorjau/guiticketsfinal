import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    const exists = await (this.prisma as any).task.findUnique({ where: { id: dto.id } });
    if (exists) throw new BadRequestException('Task id já existe');
    return (this.prisma as any).task.create({
      data: {
        id: dto.id,
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
      },
    });
  }

  findAll() {
    return (this.prisma as any).task.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const task = await (this.prisma as any).task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task não encontrada');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);
    return (this.prisma as any).task.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return (this.prisma as any).task.delete({ where: { id } });
  }
}
