import { TicketPriority } from '@prisma/client';
export declare class CreateTicketDto {
    id: string;
    title: string;
    description: string;
    authorId: string;
    priority?: TicketPriority;
    relatedSystem?: string;
    assignmentGroupId?: string;
}
