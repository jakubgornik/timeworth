import SectionHeader from "@/components/section-header";
import SectionWrapper from "@/components/section-wrapper";
import { Card } from "@/components/ui/card";
import { useUploadEmployeeFiles } from "@/hooks/storage/storage.hooks";
import { StorageCard } from "@/modules/storage/storage-card";
import { useCallback } from "react";

export default function StoragePage() {
  const { mutate: uploadFiles } = useUploadEmployeeFiles();

  const handleFilesAdded = useCallback(
    (files: File[]) => {
      uploadFiles(files);
    },
    [uploadFiles],
  );

  return (
    <>
      <SectionHeader title="Storage Page" />
      <SectionWrapper className="h-full">
        <Card className="w-full h-full bg-primary px-4 py-8">
          <StorageCard onFilesAdded={handleFilesAdded} />
          <section aria-label="Stored files" className="mt-8">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Stored Files
            </h2>
            {/* table todo */}
          </section>
        </Card>
      </SectionWrapper>
    </>
  );
}
