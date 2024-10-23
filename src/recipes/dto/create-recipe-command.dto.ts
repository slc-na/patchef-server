import { Type } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeCommandDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @Type(() => String)
  @IsUUID()
  @IsOptional()
  originalId: string;
}
