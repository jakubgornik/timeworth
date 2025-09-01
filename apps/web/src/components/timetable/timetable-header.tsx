import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ImportIcon,
  ArrowUpFromLine,
} from "lucide-react";
import { useState } from "react";
import { FileUploadDialog } from "./dialogs/file-upload-dialog/file-upload-dialog";
import { useUploadWorkEntries } from "@/hooks/work-entry/use-upload-work-entries";
import { useDownloadWorkEntriesTemplate } from "@/hooks/work-entry/use-download-import-work-entries-template";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface TimetableHeaderProps {
  weekRange: string;
  onNavigateWeek: (direction: "prev" | "next") => void;
  onAddEvent: () => void;
}

export function TimetableHeader({
  weekRange,
  onNavigateWeek,
  onAddEvent,
}: TimetableHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: importWorkEntries } = useUploadWorkEntries();

  const { mutate: downloadWorkEntriesImportTemplate } =
    useDownloadWorkEntriesTemplate();

  return (
    <div className="bg-accent text-secondary p-3 sm:p-4 rounded-t-lg border-b ">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center gap-3  min-w-0 flex-1">
          <h1 className="hidden sm:block text-md sm:text-lg md:text-xl font-semibold text-secondary truncate">
            <span>Timetable</span>
          </h1>

          <div className="flex items-center gap-1 min-w-0 flex-1">
            <Button size="sm" onClick={() => onNavigateWeek("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="sm:text-sm md:text-base font-medium px-1 sm:px-2 text-secondary text-center min-w-0 truncate">
              {weekRange}
            </span>

            <Button size="sm" onClick={() => onNavigateWeek("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onAddEvent}
                size="sm"
                className="flex items-center ml-1.5"
              >
                <span className="hidden xl:inline">Add</span>
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add work entry</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="flex items-center ml-1.5"
              >
                <span className="hidden xl:inline">Import</span>
                <ArrowUpFromLine className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Import work entries</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => downloadWorkEntriesImportTemplate()}
                size="sm"
                className="flex items-center ml-1.5"
              >
                <span className="hidden xl:inline">Download template</span>
                <ImportIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download import template</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <FileUploadDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onFileSubmit={(file) => {
            importWorkEntries(file);
          }}
        />
      </div>
    </div>
  );
}
