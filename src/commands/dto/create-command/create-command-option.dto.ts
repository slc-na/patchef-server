import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCommandParameterDto } from './create-command-parameter.dto';

export class CreateCommandOptionDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @Type(() => String)
  @IsUUID()
  @IsNotEmpty()
  id: string;

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
    type: Boolean,
    required: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  parameterRequired: boolean;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  delimiter?: string;

  @ApiProperty({
    type: CreateCommandParameterDto,
    isArray: true,
    required: false,
  })
  @Type(() => CreateCommandParameterDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  parameters?: CreateCommandParameterDto[];
}
