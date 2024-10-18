import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommandParameterDto {
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
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  payload?: string;
}
