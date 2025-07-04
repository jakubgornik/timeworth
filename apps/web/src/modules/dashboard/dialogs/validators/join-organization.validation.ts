import { z } from "zod";

export const joinOrganizationSchema = z.object({
  inviteCode: z
    .string()
    .length(8, "Organization code must be 6 characters")
    .min(8)
    .max(8),
});

export type JoinOrganizationForm = z.infer<typeof joinOrganizationSchema>;
