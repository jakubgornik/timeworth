import { PrismaClient } from "./client";
import { createPrismaAdapter } from "../src/adapter";

export const prisma = new PrismaClient({ adapter: createPrismaAdapter() });
