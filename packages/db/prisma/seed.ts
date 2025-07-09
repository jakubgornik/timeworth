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

    try {
      await prisma.user.create({
        data: {
          id: userId,
          email,
          name,
          role: "EMPLOYEE",
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
