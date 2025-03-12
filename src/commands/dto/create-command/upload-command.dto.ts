import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadCommandDTO {
  @ApiProperty({
    description: 'Folder name where the batch file will be placed',
    example: 'project123',
  })
  @IsString()
  folderName: string;

  @ApiProperty({
    description: 'Array of batch commands',
    example: ['echo Hello', 'dir', 'pause'],
  })
  @IsArray()
  @ArrayNotEmpty()
  commands: string[];
}
