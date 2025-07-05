import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { motion } from "motion/react";

interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  status: "active" | "inactive";
  bio?: string;
  skills?: string[];
  department?: string;
}

export function useTableDemo() {
  const data: Person[] = useMemo(
    () => [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        age: 30,
        email: "john@example.com",
        status: "active",
        bio: "Experienced software developer with 8+ years in full-stack development.",
        skills: ["React", "Node.js", "TypeScript", "Python"],
        department: "Engineering",
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        age: 25,
        email: "jane@example.com",
        status: "inactive",
        bio: "Creative designer passionate about user experience and visual storytelling.",
        skills: ["Figma", "Adobe Creative Suite", "Sketch", "Prototyping"],
        department: "Design",
      },
      {
        id: 3,
        firstName: "Bob",
        lastName: "Johnson",
        age: 35,
        email: "bob@example.com",
        status: "active",
        bio: "Project manager with expertise in agile methodologies and team leadership.",
        skills: ["Scrum", "Kanban", "Leadership", "Risk Management"],
        department: "Management",
      },
      {
        id: 4,
        firstName: "Alice",
        lastName: "Brown",
        age: 28,
        email: "alice@example.com",
        status: "active",
        bio: "Data scientist specializing in machine learning and statistical analysis.",
        skills: ["Python", "R", "Machine Learning", "SQL", "Statistics"],
        department: "Data Science",
      },
      {
        id: 5,
        firstName: "Charlie",
        lastName: "Wilson",
        age: 42,
        email: "charlie@example.com",
        status: "inactive",
        bio: "Senior architect with extensive experience in system design and cloud infrastructure.",
        skills: ["AWS", "Kubernetes", "Microservices", "System Design"],
        department: "Architecture",
      },
    ],
    []
  );

  const columns: ColumnDef<Person>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        meta: {
          width: 50,
        },
      },
      {
        accessorKey: "firstName",
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
      {
        accessorKey: "age",
        header: "Age",
        cell: ({ row }) => <span>{row.getValue("age")} years</span>,
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
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={`block w-full px-2 py-1 text-xs font-semibold rounded-sm text-center ${
                status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status}
            </span>
          );
        },
        meta: {
          width: 100,
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
          width: 50,
          disablePadding: true,
        },
      },
    ],
    []
  );

  const renderExpandedRow = (person: Person) => (
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
      <div className="py-3 space-y-3 p-1">
        <div className="flex items-start space-x-1">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary">
              #{person.id} {person.firstName} {person.lastName}
            </h3>
            <h4 className="font-semibold text-secondary mb-2">Biography</h4>
            <p className="text-secondary/80 text-sm leading-relaxed">
              {person.bio || "No biography available."}
            </p>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-secondary mb-2">Department</h4>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-secondary text-primary">
              {person.department}
            </span>
          </div>
        </div>

        {person.skills && person.skills.length > 0 && (
          <div>
            <h4 className="font-semibold text-secondary mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {person.skills.map((skill, index) => (
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
    </motion.div>
  );

  return { data, columns, renderExpandedRow };
}
