import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios/axios";
import axios from "axios";
import { IFileMetadataDto, IConfirmUploadDto } from "@packages/types";

//  consider moving to utils
const mapFilesToMetadata = (files: File[]): IFileMetadataDto[] => {
  return files.map((file) => ({
    name: file.name,
    type: file.type,
    size: file.size,
  }));
};

const useGetEmployeeFiles = () => {
  return useQuery({
    queryKey: ["employee-files"],
    queryFn: async () => {
      const response = await api.get("/personal-storage", {
        withCredentials: true,
      });
      return response.data;
    },
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

export { useGetEmployeeFiles, useUploadEmployeeFiles };
