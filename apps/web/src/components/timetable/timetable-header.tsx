import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, ImportIcon } from "lucide-react";
import { useState } from "react";
import { FileUploadDialog } from "./dialogs/file-upload-dialog/file-upload-dialog";

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

        <Button
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="flex items-center ml-1.5"
        >
          <span className="hidden sm:inline">Import</span>

          <ImportIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={onAddEvent}
          size="sm"
          className="flex items-center ml-1.5"
        >
          <span className="hidden sm:inline">Add</span>
          <Plus className="w-4 h-4" />
        </Button>
        <FileUploadDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onFileSubmit={(file) => {
            // TODO: Implement file upload logic
            console.log("Selected file:", file);
          }}
        />
      </div>
    </div>
  );
}
