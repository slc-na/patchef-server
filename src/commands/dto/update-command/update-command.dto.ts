import { CommandType } from '@prisma/client';
import { UpdateCommandOptionDto } from './update-command-option.dto';
import { UpdateCommandParameterDto } from './update-command-parameter.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class UpdateCommandDto {
  @Type(() => String)
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsEnum(CommandType)
  @IsOptional()
  type?: CommandType;

  @Type(() => String)
  @IsString()
  @IsOptional()
  name?: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  payload?: string;

  @Type(() => UpdateCommandOptionDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  options?: UpdateCommandOptionDto[];

  @Type(() => UpdateCommandParameterDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  parameters?: UpdateCommandParameterDto[];
}
