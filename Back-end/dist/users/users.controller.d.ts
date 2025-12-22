import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): import("@prisma/client").Prisma.Prisma__UserClient<{
        name: string;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        gender: string | null;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        gender: string | null;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByEmail(email: string): any;
    findOne(id: string): Promise<{
        name: string;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        gender: string | null;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        name: string;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        gender: string | null;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        name: string;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        gender: string | null;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOrCreate(dto: CreateUserDto): Promise<any>;
}
