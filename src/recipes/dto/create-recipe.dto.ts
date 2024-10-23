import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRecipeCommandDto } from './create-recipe-command.dto';

export class CreateRecipeDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @Type(() => String)
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: CreateRecipeCommandDto,
    isArray: true,
    required: false,
    default: [],
  })
  @Type(() => CreateRecipeCommandDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  commands?: CreateRecipeCommandDto[] = [];
}
