import { CreateCommandParameterDto } from './create-command-parameter.dto';
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

export class CreateCommandOptionDto {
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
  payload: string;

  @Type(() => Boolean)
  @IsBoolean()
  enabled: boolean;

  @Type(() => Boolean)
  @IsBoolean()
  parameterRequired: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  delimiter?: string;

  @Type(() => CreateCommandParameterDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  parameters?: CreateCommandParameterDto[];
}
