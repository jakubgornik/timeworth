import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsString,
  IsNotEmpty,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IFileMetadataDto,
  IConfirmUploadDto,
  IUploadFilesDto,
  STORAGE_LIMITS,
} from '@packages/types';
import { Trim } from '../../../shared/decorators/trim.decorator';

export class FileMetadataDto implements IFileMetadataDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(STORAGE_LIMITS.maxNameLength)
  name: string;

  @IsString()
  @IsIn(STORAGE_LIMITS.allowedMimeTypes)
  type: string;

  @IsInt()
  @Min(1)
  @Max(STORAGE_LIMITS.maxFileBytes)
  size: number;
}

// The wrapper preserves the element class so ValidationPipe validates every file.
export class UploadFilesDto implements IUploadFilesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(STORAGE_LIMITS.maxFilesPerRequest)
  @ValidateNested({ each: true })
  @Type(() => FileMetadataDto)
  files: FileMetadataDto[];
}

export class ConfirmUploadDto implements IConfirmUploadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  fileId: string;
}
