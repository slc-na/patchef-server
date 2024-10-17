import { CommandType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateCommandOptionDto } from './create-command-option.dto';
import { CreateCommandParameterDto } from './create-command-parameter.dto';

export class CreateCommandDto {
  @Type(() => String)
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsEnum(CommandType)
  type: CommandType;

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
  payload: string;

  @Type(() => CreateCommandOptionDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  options?: CreateCommandOptionDto[];

  @Type(() => CreateCommandParameterDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  parameters?: CreateCommandParameterDto[];
}
