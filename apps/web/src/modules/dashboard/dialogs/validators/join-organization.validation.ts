import { z } from "zod";

export const joinOrganizationSchema = z.object({
  code: z
    .string()
    .length(6, "Organization code must be 6 characters")
    .min(6)
    .max(6),
});

export type JoinOrganizationForm = z.infer<typeof joinOrganizationSchema>;
