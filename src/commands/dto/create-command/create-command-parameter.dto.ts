import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as generateUuidV4 } from 'uuid';

export class CreateCommandParameterDto {
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

  constructor() {
    if (!this.id) {
      this.id = generateUuidV4();
    }
  }
}
