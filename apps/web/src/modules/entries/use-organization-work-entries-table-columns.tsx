import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { motion } from "motion/react";
import { IWorkEntryDto } from "@packages/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, FileText } from "lucide-react";

export function useOrganizationWorkEntriesTableColumns() {
  const columns: ColumnDef<IWorkEntryDto>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "hoursWorked",
        header: "Hours Worked",
      },
      {
        id: "expand",
        header: "Details",
        cell: ({ row }) => {
          const isExpanded = row.getIsExpanded();

          return (
            <button
              className="flex justify-center items-center w-full h-full min-h-[48px] py-4"
              onClick={(e) => {
                e.stopPropagation();
                row.toggleExpanded();
              }}
            >
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{
                  rotate: isExpanded ? 90 : 0,
                  scale: isExpanded ? 1.1 : 1,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0.0, 0.2, 1],
                  type: "tween",
                }}
                whileHover={{
                  scale: 1.2,
                  transition: { duration: 0.2 },
                }}
                whileTap={{
                  scale: 0.9,
                  transition: { duration: 0.1 },
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </button>
          );
        },
        meta: {
          width: 100,
          disablePadding: true,
        },
      },
    ],
    []
  );

  const formatDateTime = (dateInput: string | Date) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const renderExpandedRow = (workEntry: IWorkEntryDto) => {
    const startDateTime = formatDateTime(workEntry.startedAt);
    const endDateTime = formatDateTime(workEntry.endedAt);

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="overflow-hidden h-full"
      >
        <div className="h-full py-2  pr-4 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 min-h-0">
            <div className="space-y-2 flex flex-col h-full">
              <Card className="bg-card p-4 rounded-lg border border-border/50 flex-1">
                <CardHeader className="font-semibold text-secondary mb-1 flex items-center p-0">
                  <Clock className="w-4 h-4 mr-2" />
                  Worked Time Details
                </CardHeader>
                <CardContent className="p-0 flex lg:flex-row flex-col">
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <span className="text-sm text-secondary/70 ">
                        Started at
                      </span>
                      <span className="text-sm font-medium text-secondary">
                        {startDateTime.date}
                      </span>
                      <span className="text-sm text-secondary/80">
                        {startDateTime.time}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm text-secondary/70 ">
                        Ended at
                      </span>
                      <span className="text-sm font-medium text-secondary">
                        {endDateTime.date}
                      </span>
                      <span className="text-sm text-secondary/80">
                        {endDateTime.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex  mt-2 gap-2">
                    <span className="text-sm text-secondary/70">Duration</span>
                    <span className="text-sm font-semibold text-secondary">
                      {workEntry.hoursWorked} hours
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-2 flex flex-col h-full flex-1">
              <Card className="bg-card rounded-lg border border-border/50 flex flex-col flex-1 p-4">
                <CardHeader className="font-semibold text-secondary mb-1 flex items-center p-0">
                  <FileText className="w-4 h-4 mr-2" />
                  Work Entry Details
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-row">
                  <div className="flex-1 pb-1">
                    <div className="text-sm text-secondary/70 mb-2">Title</div>
                    <h3 className="text-lg font-semibold text-secondary leading-relaxed">
                      {workEntry.title}
                    </h3>
                  </div>
                  <div className="border-t border-border/30 my-3"></div>
                  <div className="flex-1 pt-1">
                    <div className="text-sm text-secondary/70 mb-2">
                      Description
                    </div>
                    <div className="max-h-[70px] overflow-y-auto">
                      <p className="text-secondary/80 text-sm leading-relaxed">
                        {workEntry.description || (
                          <span className="italic text-secondary/50">
                            No description available
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return { columns, renderExpandedRow };
}
