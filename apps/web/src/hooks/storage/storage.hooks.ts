import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import api from "@/lib/axios/axios";
import axios from "axios";
import {
  IFileMetadataDto,
  IConfirmUploadDto,
  IPaginatedResponseDto,
  IStorageFileDto,
  IPaginatedStorageFileQueryDto,
} from "@packages/types";

const mapFilesToMetadata = (files: File[]): IFileMetadataDto[] => {
  return files.map((file) => ({
    name: file.name,
    type: file.type,
    size: file.size,
  }));
};

const useGetStorage = (query: IPaginatedStorageFileQueryDto) => {
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

const useUploadEmployeeFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (files: File[]) => {
      const fileMetadata = mapFilesToMetadata(files);

      const { data } = await api.post(
        "/personal-storage/presigned-urls",
        fileMetadata,
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

      await Promise.all(uploadPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-files"] });
    },
  });
};

export { useGetStorage, useUploadEmployeeFiles };
