import { PrismaClient } from "../prisma/client";
import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const demoAccount = {
  email: "test@test.com",
  password: "Testpassword123",
  name: "Test User",
};

const managerAccount = {
  email: "manager@demo.com",
  password: "Managerpassword123",
  name: "Demo Manager",
};

async function createUserWithSupabase(email: string, password: string) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    throw new Error(`Failed to create Supabase user: ${error.message}`);
  }

  return data.user.id;
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not run seeds in production");
  }

  console.log("Creating test demo user...");
  const testUserId = await createUserWithSupabase(
    demoAccount.email,
    demoAccount.password
  );

  await prisma.user.upsert({
    where: { email: demoAccount.email },
    update: {},
    create: {
      id: testUserId,
      email: demoAccount.email,
      name: demoAccount.name,
    },
  });

  console.log("Creating organization manager...");
  const managerId = await createUserWithSupabase(
    managerAccount.email,
    managerAccount.password
  );

  const organization = await prisma.organization.create({
    data: {
      name: "DemoCorp Inc.",
      inviteCode: faker.string.alphanumeric(8),
      managerId,
      industry: faker.company.buzzNoun(),
      size: "51-200",
      address: faker.location.streetAddress(),
    },
  });

  await prisma.user.create({
    data: {
      id: managerId,
      email: managerAccount.email,
      name: managerAccount.name,
      role: "MANAGER",
      organizationId: organization.id,
    },
  });

  console.log("Creating 20 employee users...");
  for (let i = 0; i < 20; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email({ firstName: name.split(" ")[0] });
    const userId = randomUUID();

    const allSkills = [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "Java",
      "C#",
      "SQL",
      "MongoDB",
      "PostgreSQL",
      "AWS",
      "Docker",
      "Kubernetes",
      "Git",
      "Agile",
      "Scrum",
      "REST APIs",
      "GraphQL",
      "Testing",
      "DevOps",
      "HTML",
      "CSS",
      "Vue.js",
      "Angular",
      "Express",
      "Next.js",
      "Redis",
      "Project Management",
      "Leadership",
      "Communication",
      "Problem Solving",
    ];

    const numSkills = faker.number.int({ min: 1, max: 3 });
    const skills = faker.helpers.arrayElements(allSkills, numSkills);

    const bioTemplates = [
      `${faker.number.int({ min: 2, max: 8 })} years of experience in software development.`,
      `Passionate about ${skills[0].toLowerCase()} and clean code.`,
      `Full-stack developer with focus on ${skills[0].toLowerCase()}.`,
      `Experienced in ${skills[0].toLowerCase()} and team collaboration.`,
      `Software engineer specializing in ${skills[0].toLowerCase()}.`,
      `${faker.number.int({ min: 1, max: 5 })} years in ${faker.company.buzzNoun()} industry.`,
      `Enjoys solving complex problems with ${skills[0].toLowerCase()}.`,
      `Detail-oriented developer with ${skills[0].toLowerCase()} expertise.`,
    ];

    const bio = faker.helpers.arrayElement(bioTemplates);

    try {
      await prisma.user.create({
        data: {
          id: userId,
          email,
          name,
          bio,
          skills,
          organizationId: organization.id,
        },
      });
    } catch (err) {
      console.warn(`⚠️ Failed to create user ${email}:`, err);
    }
  }

  console.log("✅ Completed");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
