import { PrismaClient } from "../prisma/client/index";
import { createClient } from "@supabase/supabase-js";

//TODO: move to shared to keep in sync with web
const demoAccountdata = {
  email: "test@test.com",
  password: "testpassword123",
  name: "Test User",
};

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: demoAccountdata.email,
    password: demoAccountdata.password,
    email_confirm: true,
  });
  if (error) {
    console.error("Error creating demo user:", error);
    return;
  }

  await prisma.user.upsert({
    where: { email: demoAccountdata.email },
    update: {},
    create: {
      id: data.user.id,
      email: demoAccountdata.email,
      name: demoAccountdata.name,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
