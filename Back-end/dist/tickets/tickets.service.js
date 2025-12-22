"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TicketsService = class TicketsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const exists = await this.prisma.ticket.findUnique({ where: { id: dto.id } });
        if (exists)
            throw new common_1.BadRequestException('Ticket id already exists');
        return this.prisma.ticket.create({
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
        return this.prisma.ticket.findMany({
            orderBy: { createdAt: 'desc' },
            include: { author: true, assignedTo: true, completedBy: true },
        });
    }
    async findOne(id) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
            include: { author: true, assignedTo: true, completedBy: true, messages: true, attachments: true, tags: true },
        });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        return ticket;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.ticket.update({
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
    async remove(id) {
        await this.findOne(id);
        return this.prisma.ticket.delete({ where: { id } });
    }
    async assign(id, userId) {
        await this.findOne(id);
        return this.prisma.ticket.update({
            where: { id },
            data: { assignedTo: { connect: { id: userId } }, status: 'IN_PROGRESS' },
            include: { author: true, assignedTo: true, completedBy: true },
        });
    }
    async reopen(id) {
        await this.findOne(id);
        return this.prisma.ticket.update({
            where: { id },
            data: { status: 'OPEN', completedBy: { disconnect: true } },
            include: { author: true, assignedTo: true, completedBy: true },
        });
    }
    async updateStatus(id, dto) {
        await this.findOne(id);
        return this.prisma.ticket.update({
            where: { id },
            data: { status: dto.status },
            include: { author: true, assignedTo: true, completedBy: true },
        });
    }
    async addMessage(id, dto) {
        await this.findOne(id);
        return this.prisma.ticketMessage.create({
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
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map