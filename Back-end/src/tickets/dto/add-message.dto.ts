import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class AddMessageDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsString()
  authorName: string;

  @IsEmail()
  authorEmail: string;

  @IsOptional()
  @IsBoolean()
  isAgent?: boolean;
}
