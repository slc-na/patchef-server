import { CommandType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateCommandOptionDto } from './update-command-option.dto';
import { UpdateCommandParameterDto } from './update-command-parameter.dto';

export class UpdateCommandDto {
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
    required: false,
  })
  @IsEnum(CommandType)
  @IsOptional()
  type?: CommandType;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  payload?: string;

  @ApiProperty({
    type: UpdateCommandOptionDto,
    isArray: true,
    required: false,
  })
  @Type(() => UpdateCommandOptionDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  options?: UpdateCommandOptionDto[];

  @ApiProperty({
    type: UpdateCommandParameterDto,
    isArray: true,
    required: false,
  })
  @Type(() => UpdateCommandParameterDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  parameters?: UpdateCommandParameterDto[];
}
