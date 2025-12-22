import { IsOptional, IsString, Matches } from 'class-validator';

export class CreateAssignmentGroupDto {
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  key!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
