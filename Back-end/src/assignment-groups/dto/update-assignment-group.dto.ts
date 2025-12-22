import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateAssignmentGroupDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  key?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
