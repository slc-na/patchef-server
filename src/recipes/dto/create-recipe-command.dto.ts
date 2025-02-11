import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCommandParameterDto } from 'src/commands/dto/create-command/create-command-parameter.dto';
import { CreateCommandOptionDto } from 'src/commands/dto/create-command/create-command-option.dto';

export class CreateRecipeCommandDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @Type(() => String)
  @IsUUID()
  @IsOptional()
  originalId: string;

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
  @Transform(({ value }) =>
    Array.isArray(value) && value.length === 0 ? undefined : value,
  )
  parameters?: CreateCommandParameterDto[];

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
  @Transform(({ value }) =>
    Array.isArray(value) && value.length === 0 ? undefined : value,
  )
  options?: CreateCommandOptionDto[];
}
