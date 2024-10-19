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
import { CreateCommandOptionDto } from '../create-command/create-command-option.dto';
import { CreateCommandParameterDto } from '../create-command/create-command-parameter.dto';

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

  /*
   * Prisma does not support nested createMany operations. This means that we
   * cannot update a command with nested options and parameters in a single
   * transaction. We need to delete the existing options and parameters and
   * create new ones, that's why we use CreateCommandOptionDto and
   * CreateCommandParameterDto.
   *
   * - MY23-1
   */
  @ApiProperty({
    type: CreateCommandOptionDto,
    isArray: true,
    required: false,
    description:
      "Note: Prisma does not support nested createMany operations, This means that we cannot update a command with nested options and parameters in a single transaction. We need to delete the existing options and parameters and create new ones, that's why we use CreateCommandOptionDto and CreateCommandParameterDto. - MY23-1",
  })
  @Type(() => CreateCommandOptionDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  options?: CreateCommandOptionDto[];

  @ApiProperty({
    type: CreateCommandParameterDto,
    isArray: true,
    required: false,
    description:
      "Note: Prisma does not support nested createMany operations, This means that we cannot update a command with nested options and parameters in a single transaction. We need to delete the existing options and parameters and create new ones, that's why we use CreateCommandOptionDto and CreateCommandParameterDto. - MY23-1",
  })
  @Type(() => CreateCommandParameterDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  parameters?: CreateCommandParameterDto[];
}
