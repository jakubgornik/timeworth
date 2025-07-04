import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

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
      {
        id: 6,
        firstName: "Diana",
        lastName: "Davis",
        age: 31,
        email: "diana@example.com",
        status: "active",
        bio: "Marketing specialist focused on digital campaigns and brand strategy.",
        skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
        department: "Marketing",
      },
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
      {
        id: 6,
        firstName: "Diana",
        lastName: "Davis",
        age: 31,
        email: "diana@example.com",
        status: "active",
        bio: "Marketing specialist focused on digital campaigns and brand strategy.",
        skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
        department: "Marketing",
      },
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
      {
        id: 6,
        firstName: "Diana",
        lastName: "Davis",
        age: 31,
        email: "diana@example.com",
        status: "active",
        bio: "Marketing specialist focused on digital campaigns and brand strategy.",
        skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
        department: "Marketing",
      },
    ],
    []
  );

  const columns: ColumnDef<Person>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.getValue("id")}</span>
        ),
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("firstName")}</span>
        ),
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("lastName")}</span>
        ),
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
            className="text-blue-600 hover:underline"
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
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
    ],
    []
  );

  const renderExpandedRow = (person: Person) => (
    <div className="space-y-3">
      <div className="flex items-start space-x-6">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">Biography</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {person.bio || "No biography available."}
          </p>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">Department</h4>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {person.department || "Not specified"}
          </span>
        </div>
      </div>

      {person.skills && person.skills.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {person.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return { data, columns, renderExpandedRow };
}
