import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum PublishedRecipeStatus {
  Success = 'success',
  Failed = 'failed',
}

export enum PublishedRecipeErrorCode {
  Unknown = 'UNKNOWN',
  FileTransferError = 'FILE_TRANSFER_ERROR',
  FileExists = 'FILE_EXISTS',
}

export class PublishedRecipeEntity {
  @ApiProperty({ type: String, required: true })
  @Expose()
  status: 'success' | 'failed';

  @ApiProperty({ type: String, required: false })
  @Expose()
  errorDescription?: string;

  @ApiProperty({ type: String, required: false })
  @Expose()
  errorCode?: PublishedRecipeErrorCode;

  @ApiProperty({ type: String, required: false })
  @Expose()
  filePath?: string;

  constructor(partial: Partial<PublishedRecipeEntity>) {
    Object.assign(this, partial);
  }
}
