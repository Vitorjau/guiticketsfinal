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
exports.AssignmentGroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssignmentGroupsService = class AssignmentGroupsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.assignmentGroup.findUnique({ where: { key: dto.key } });
        if (existing)
            throw new common_1.BadRequestException('Chave de grupo já existe');
        return this.prisma.assignmentGroup.create({ data: dto });
    }
    findAll() {
        return this.prisma.assignmentGroup.findMany({ orderBy: { name: 'asc' } });
    }
    async findOne(id) {
        const group = await this.prisma.assignmentGroup.findUnique({ where: { id } });
        if (!group)
            throw new common_1.NotFoundException('Grupo não encontrado');
        return group;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.key) {
            const existsKey = await this.prisma.assignmentGroup.findUnique({ where: { key: dto.key } });
            if (existsKey && existsKey.id !== id)
                throw new common_1.BadRequestException('Chave de grupo já utilizada');
        }
        return this.prisma.assignmentGroup.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.assignmentGroup.delete({ where: { id } });
    }
};
exports.AssignmentGroupsService = AssignmentGroupsService;
exports.AssignmentGroupsService = AssignmentGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssignmentGroupsService);
//# sourceMappingURL=assignment-groups.service.js.map