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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
        return this.prisma.user.create({ data: dto });
    }
    findAll() {
        return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    }
    findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async findOrCreate(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            return existing;
        return this.create(dto);
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.user.update({ where: { id }, data: dto });
    }
    async updateProfile(id, dto) {
        const user = await this.findOne(id);
        if (dto.email && dto.email !== user.email) {
            const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (existing)
                throw new common_1.BadRequestException('Email já cadastrado');
        }
        return this.prisma.user.update({
            where: { id },
            data: {
                name: dto.name || user.name,
                email: dto.email || user.email,
                phone: dto.phone,
                gender: dto.gender,
                updatedAt: new Date()
            }
        });
    }
    async changePassword(id, dto) {
        const user = await this.findOne(id);
        if (user.passwordHash !== dto.currentPassword) {
            throw new common_1.BadRequestException('Senha atual incorreta');
        }
        if (dto.newPassword !== dto.confirmPassword) {
            throw new common_1.BadRequestException('Senhas não conferem');
        }
        if (dto.newPassword === dto.currentPassword) {
            throw new common_1.BadRequestException('Nova senha deve ser diferente da senha atual');
        }
        return this.prisma.user.update({
            where: { id },
            data: {
                passwordHash: dto.newPassword,
                updatedAt: new Date()
            }
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map