import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AddMessageDto } from './dto/add-message.dto';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTicketDto) {
    // Ensure id uniqueness is handled by DB, but check for clearer message
    const exists = await (this.prisma as any).ticket.findUnique({ where: { id: dto.id } });
    if (exists) throw new BadRequestException('Ticket id already exists');

    return (this.prisma as any).ticket.create({
      data: {
        id: dto.id,
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        relatedSystem: dto.relatedSystem,
        author: { connect: { id: dto.authorId } },
        assignmentGroup: dto.assignmentGroupId
          ? { connect: { id: dto.assignmentGroupId } }
          : undefined,
      },
      include: { author: true, assignedTo: true, completedBy: true },
    });
  }

  findAll() {
    return (this.prisma as any).ticket.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true, assignedTo: true, completedBy: true },
    });
  }

  async findOne(id: string) {
    const ticket = await (this.prisma as any).ticket.findUnique({
      where: { id },
      include: { author: true, assignedTo: true, completedBy: true, messages: true, attachments: true, tags: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async update(id: string, dto: UpdateTicketDto) {
    await this.findOne(id);
    return (this.prisma as any).ticket.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        relatedSystem: dto.relatedSystem,
        assignmentGroup: dto.assignmentGroupId
          ? { connect: { id: dto.assignmentGroupId } }
          : dto.assignmentGroupId === null
          ? { disconnect: true }
          : undefined,
        assignedTo: dto.assignedToId
          ? { connect: { id: dto.assignedToId } }
          : undefined,
      },
      include: { author: true, assignedTo: true, completedBy: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return (this.prisma as any).ticket.delete({ where: { id } });
  }

  async assign(id: string, userId: string) {
    await this.findOne(id);
    return (this.prisma as any).ticket.update({
      where: { id },
      data: { assignedTo: { connect: { id: userId } }, status: 'IN_PROGRESS' },
      include: { author: true, assignedTo: true, completedBy: true },
    });
  }

  async reopen(id: string) {
    await this.findOne(id);
    return (this.prisma as any).ticket.update({
      where: { id },
      data: { status: 'OPEN', completedBy: { disconnect: true } },
      include: { author: true, assignedTo: true, completedBy: true },
    });
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    await this.findOne(id);
    return (this.prisma as any).ticket.update({
      where: { id },
      data: { status: dto.status },
      include: { author: true, assignedTo: true, completedBy: true },
    });
  }

  async addMessage(id: string, dto: AddMessageDto) {
    await this.findOne(id);
    return (this.prisma as any).ticketMessage.create({
      data: {
        ticket: { connect: { id } },
        author: dto.authorId ? { connect: { id: dto.authorId } } : undefined,
        authorName: dto.authorName,
        authorEmail: dto.authorEmail,
        content: dto.content,
        isAgent: dto.isAgent ?? false,
      },
    });
  }
}
