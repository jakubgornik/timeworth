import { IPaginatedQueryDto } from "../utils";

export interface IFileMetadataDto {
  name: string;
  type: string;
  size: number;
}

export interface IStorageFileDto extends IFileMetadataDto {
  id: string;
  uploadDate: string;
}

export interface IConfirmUploadDto {
  fileId: string;
}

export interface IPresignedUrlResponse {
  id: string;
  uploadUrl: string;
}

export interface IGetStorageFileDto {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
}

export type IPaginatedStorageFileQueryDto = IPaginatedQueryDto; // todo add filters

export interface IGetFileDownloadUrlDto {
  url: string;
}
