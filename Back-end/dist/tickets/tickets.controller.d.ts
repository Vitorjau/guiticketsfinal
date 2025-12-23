import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AddMessageDto } from './dto/add-message.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(dto: CreateTicketDto): Promise<any>;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateTicketDto): Promise<any>;
    remove(id: string): Promise<any>;
    assign(id: string, userId: string): Promise<any>;
    reopen(id: string): Promise<any>;
    updateStatus(id: string, dto: UpdateStatusDto): Promise<any>;
    addMessage(id: string, dto: AddMessageDto): Promise<any>;
    addAttachments(id: string, dto: any): Promise<any>;
}
