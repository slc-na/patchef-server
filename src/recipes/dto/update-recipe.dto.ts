import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateCommandDto } from 'src/commands/dto/update-command/update-command.dto';

export class UpdateRecipeDto {
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
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: UpdateCommandDto,
    isArray: true,
    required: false,
  })
  @Type(() => UpdateCommandDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  commands?: UpdateCommandDto[];
}
