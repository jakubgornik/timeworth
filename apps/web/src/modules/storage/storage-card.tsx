"use client";

import { useCallback, useState } from "react";
import { type FileRejection } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HardDrive } from "lucide-react";
import { Dropzone } from "@/components/dropzone/dropzone";

interface DropzoneCardProps {
  onFilesAdded: (files: File[]) => void;
}

export function StorageCard({ onFilesAdded }: DropzoneCardProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setErrorMessage(null);
      if (rejected.length > 0) {
        setErrorMessage(
          "Some files were rejected. Only PDF, TXT, and XLSX files under 50 MB are allowed.",
        );
        return;
      }
      if (accepted.length > 0) {
        onFilesAdded(accepted);
      }
    },
    [onFilesAdded],
  );

  return (
    <Card className="border-none bg-accent">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-secondary" />
          <CardTitle className="text-base font-semibold text-foreground">
            Personal File Space
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          Drop any files below to store them in your own personal space. They
          will be kept private and accessible only to you. You can upload
          multiple files at once.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dropzone
          onDrop={handleDrop}
          errorMessage={errorMessage ?? undefined}
          multiple={true}
          maxFiles={20}
        />
      </CardContent>
    </Card>
  );
}
