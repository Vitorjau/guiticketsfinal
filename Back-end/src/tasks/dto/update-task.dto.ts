import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TaskStatusDto } from './create-task.dto';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

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
