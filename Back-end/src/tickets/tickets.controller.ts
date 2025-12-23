import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AddMessageDto } from './dto/add-message.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }

  @Post(':id/assign/:userId')
  assign(@Param('id') id: string, @Param('userId') userId: string) {
    return this.ticketsService.assign(id, userId);
  }

  @Post(':id/reopen')
  reopen(@Param('id') id: string) {
    return this.ticketsService.reopen(id);
  }

  @Post(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.ticketsService.updateStatus(id, dto);
  }

  @Post(':id/messages')
  addMessage(@Param('id') id: string, @Body() dto: AddMessageDto) {
    return this.ticketsService.addMessage(id, dto);
  }

  // MVP: registra metadados de anexos já uploadados (ex.: Cloudinary URL)
  @Post(':id/attachments')
  addAttachments(
    @Param('id') id: string,
    @Body() dto: any, // Aceita objeto ou array sem DTO por enquanto
  ) {
    return this.ticketsService.addAttachments(id, dto);
  }
}
