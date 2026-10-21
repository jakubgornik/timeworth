import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import api from "@/lib/axios/axios";
import axios from "axios";
import { useNotification } from "../use-notification";
import {
  IFileMetadataDto,
  IConfirmUploadDto,
  IPaginatedResponseDto,
  IStorageFileDto,
  IPaginatedStorageFileQueryDto,
  IGetFileDownloadUrlDto,
  IPresignedUrlResponse,
  IUploadFilesDto,
} from "@packages/types";

const mapFilesToMetadata = (files: File[]): IFileMetadataDto[] => {
  return files.map((file) => ({
    name: file.name,
    type: file.type,
    size: file.size,
  }));
};

const useGetStorageFile = (query: IPaginatedStorageFileQueryDto) => {
  return useQuery({
    queryKey: ["employee-files", query],
    queryFn: async () => {
      const res = await api.get<IPaginatedResponseDto<IStorageFileDto>>(
        "/personal-storage",
        {
          params: query,
          withCredentials: true,
        },
      );

      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};

const useUploadStorageFile = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: async (files: File[]) => {
      const fileMetadata = mapFilesToMetadata(files);

      const body: IUploadFilesDto = { files: fileMetadata };
      const { data } = await api.post<IPresignedUrlResponse[]>(
        "/personal-storage/presigned-urls",
        body,
        { withCredentials: true },
      );

      const uploadPromises = files.map(async (file, index) => {
        const { id, uploadUrl } = data[index];
        const confirmData: IConfirmUploadDto = { fileId: id };

        await axios.put(uploadUrl, file, {
          headers: { "Content-Type": file.type },
        });

        await api.post("/personal-storage/confirm-upload", confirmData, {
          withCredentials: true,
        });
      });

      const results = await Promise.allSettled(uploadPromises);
      const failure = results.find((result) => result.status === "rejected");
      if (failure) throw failure.reason;
    },
    onSuccess: () => {
      showSuccess("Files uploaded successfully");
    },
    onError: () => {
      showError("Some files could not be uploaded. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-files"] });
    },
  });
};

const useDeleteStorageFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/personal-storage/${id}`, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-files"] });
    },
  });
};

const useDownloadStorageFile = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.get<IGetFileDownloadUrlDto>(
        `/personal-storage/${id}/download`,
        {
          withCredentials: true,
        },
      );

      const link = document.createElement("a");
      link.href = data.url;
      link.target = "_blank";
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return data;
    },
  });
};

export {
  useGetStorageFile,
  useUploadStorageFile,
  useDeleteStorageFile,
  useDownloadStorageFile,
};
