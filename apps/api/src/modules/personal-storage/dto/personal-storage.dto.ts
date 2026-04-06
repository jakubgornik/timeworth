import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { IFileMetadataDto, IConfirmUploadDto } from '@packages/types';

export class FileMetadataDto implements IFileMetadataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  size: number;
}

export class ConfirmUploadDto implements IConfirmUploadDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;
}
