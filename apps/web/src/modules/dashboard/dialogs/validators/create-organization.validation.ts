import { z } from "zod";

export const createOrganizationSchema = z.object({
  managerName: z.string().min(2, "Manager name must be at least 2 characters"),
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters"),
  industry: z.string().optional(),
  size: z.string().optional(),
  address: z.string().optional(),
});

export type CreateOrganizationForm = z.infer<typeof createOrganizationSchema>;
