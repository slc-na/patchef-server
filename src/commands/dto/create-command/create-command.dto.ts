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
import { ApiProperty } from '@nestjs/swagger';
import { CreateCommandOptionDto } from './create-command-option.dto';
import { CreateCommandParameterDto } from './create-command-parameter.dto';
import { v4 as generateUuidV4 } from 'uuid';

export class CreateCommandDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @Type(() => String)
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    enum: CommandType,
    required: true,
  })
  @IsEnum(CommandType)
  type: CommandType;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  payload: string;

  @ApiProperty({
    type: CreateCommandOptionDto,
    isArray: true,
    required: false,
    default: [],
  })
  @Type(() => CreateCommandOptionDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  options?: CreateCommandOptionDto[] = [];

  @ApiProperty({
    type: CreateCommandParameterDto,
    isArray: true,
    required: false,
    default: [],
  })
  @Type(() => CreateCommandParameterDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  parameters?: CreateCommandParameterDto[] = [];

  constructor() {
    if (!this.id) {
      this.id = generateUuidV4();
    }
  }
}
