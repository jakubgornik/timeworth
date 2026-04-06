export interface IFileMetadataDto {
  name: string;
  type: string;
  size: number;
}

export interface IConfirmUploadDto {
  fileId: string;
}

export interface IPresignedUrlResponse {
  id: string;
  uploadUrl: string;
}
