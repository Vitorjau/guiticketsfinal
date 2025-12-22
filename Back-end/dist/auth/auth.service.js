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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user)
            throw new common_1.UnauthorizedException('Email ou senha inválidos');
        if (user.passwordHash !== dto.password) {
            throw new common_1.UnauthorizedException('Email ou senha inválidos');
        }
        return user;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.BadRequestException('Email já cadastrado');
        let role = 'REQUESTER';
        if (dto.agentCode) {
            const agentCode = await this.prisma.agentCode.findUnique({ where: { code: dto.agentCode } });
            if (!agentCode)
                throw new common_1.BadRequestException('Código de agente inválido');
            if (agentCode.used)
                throw new common_1.BadRequestException('Código de agente já foi utilizado');
            role = 'AGENT';
            await this.prisma.agentCode.update({
                where: { code: dto.agentCode },
                data: { used: true, usedBy: 'pending' }
            });
        }
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash: dto.password,
                role
            }
        });
        if (dto.agentCode) {
            await this.prisma.agentCode.update({
                where: { code: dto.agentCode },
                data: { usedBy: user.id }
            });
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map