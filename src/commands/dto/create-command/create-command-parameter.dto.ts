import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommandParameterDto {
  @Type(() => String)
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  payload?: string;
}
