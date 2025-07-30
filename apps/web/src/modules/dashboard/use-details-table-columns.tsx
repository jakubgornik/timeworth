import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { motion } from "motion/react";
import { ICurrentUserDto } from "@packages/types";

export function useUserDetailsTableColumns() {
  const columns: ColumnDef<ICurrentUserDto>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },

      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <a
            href={`mailto:${row.getValue("email")}`}
            className="text-secondary hover:underline"
          >
            {row.getValue("email")}
          </a>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        // TODO: make a component for status
        cell: ({ row }) => {
          const status = row.getValue<string>("status");
          const statusColors = {
            ACTIVE: "bg-green-100 text-green-800",
            AVAILABLE: "bg-blue-100 text-blue-800",
            ASSIGNED: "bg-orange-100 text-orange-800",
            INACTIVE: "bg-red-100 text-red-800",
            SUSPENDED: "bg-red-100 text-red-800",
          };

          return (
            <span
              className={`block w-full px-2 py-1 text-xs font-semibold rounded-sm text-center ${
                statusColors[status as keyof typeof statusColors] ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
          );
        },
        meta: {
          width: 120,
        },
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

  const renderExpandedRow = (user: ICurrentUserDto) => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="overflow-hidden"
    >
      <div className="py-3 space-y-3 p-1 relative">
        <div className="absolute top-1 right-1">
          <span className="text-xs text-secondary/50 bg-accent px-1.5 py-0.5 rounded">
            # {user.id}
          </span>
        </div>
        <div className="flex items-start space-x-6 pr-20">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary mb-3">
              {user.name}
            </h3>
            <h4 className="font-semibold text-secondary mb-2">Biography</h4>
            <p className="text-secondary/80 text-sm leading-relaxed">
              {user.bio || "No biography available."}
            </p>
          </div>
          {user.skills && user.skills.length > 0 && (
            <div className="flex-1 flex flex-col self-center">
              <h4 className="font-semibold text-secondary mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-secondary text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return { columns, renderExpandedRow };
}
