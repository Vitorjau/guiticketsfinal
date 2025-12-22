import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    login(dto: LoginDto): Promise<any>;
    register(dto: RegisterDto): Promise<any>;
}
