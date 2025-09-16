import { z } from "zod";

export const joinOrganizationSchema = z.object({
  inviteCode: z
    .string()
    .length(8, "Organization code must be 8 characters")
    .min(8)
    .max(8),
  name: z.string().min(2).max(40),
});

export type JoinOrganizationForm = z.infer<typeof joinOrganizationSchema>;
