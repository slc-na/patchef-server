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
import { CreateCommandDto } from 'src/commands/dto/create-command/create-command.dto';

export class CreateRecipeDto {
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
    type: CreateCommandDto,
    isArray: true,
    required: false,
    default: [],
  })
  @Type(() => CreateCommandDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  commands?: CreateCommandDto[] = [];
}
