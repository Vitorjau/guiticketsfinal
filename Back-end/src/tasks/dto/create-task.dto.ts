import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum TaskStatusDto {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class CreateTaskDto {
  @IsString()
  id!: string; // e.g., TASK-001

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatusDto)
  status?: TaskStatusDto;

  @IsOptional()
  @IsString()
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
