import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketPriority } from '@prisma/client';

export class CreateTicketDto {
  @IsString()
  id: string; // friendly code like TCK-001

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  authorId: string;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @IsOptional()
  @IsString()
  relatedSystem?: string;

  @IsOptional()
  @IsString()
  assignmentGroupId?: string;
}
