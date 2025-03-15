import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PublishRecipeDto {
  @ApiProperty({
    description: 'Directory name where the batch script file will be created',
    example: 'install-visual-studio-code',
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  directoryName: string;

  @ApiProperty({
    description: 'Directory name where the batch script file will be created',
    example: 'install-visual-studio-code',
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'Overwrite the existing file',
    example: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  overwrite?: boolean;

  @ApiProperty({
    description: 'Array of batch script commands',
    example: ['echo "Hello"', 'dir', 'pause'],
  })
  @Type(() => String)
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  commands: string[];
}
