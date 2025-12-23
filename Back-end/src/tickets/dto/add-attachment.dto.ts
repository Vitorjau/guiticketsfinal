import { IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class AddAttachmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  size: number;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsUrl()
  url: string;
}

