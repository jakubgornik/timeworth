import SectionHeader from "@/components/section-header";
import SectionWrapper from "@/components/section-wrapper";
import { Card } from "@/components/ui/card";
import { useCallback } from "react";
import { DropzoneCard } from "@/modules/storage/storage-card";

export default function StoragePage() {
  const handleFilesAdded = useCallback((files: File[]) => {}, []);

  return (
    <>
      <SectionHeader title="Storage Page" />
      <SectionWrapper className="h-full">
        <Card className="w-full h-full bg-primary px-4 py-8">
          <DropzoneCard onFilesAdded={handleFilesAdded} />
          <section aria-label="Stored files">
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
