import { PrismaService } from '../prisma/prisma.service';
export declare class InviteCodesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(code: string): Promise<{
        code: string;
        exists: boolean;
        valid: boolean;
        used: boolean;
        usedBy: any;
    }>;
}
