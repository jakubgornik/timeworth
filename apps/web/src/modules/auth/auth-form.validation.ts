import { z } from "zod";

const errorMessages = {
  email: "Please enter a valid email address",
  password: {
    min: "Password must be at least 8 characters long",
    uppercase: "Password must contain at least one uppercase letter",
    lowercase: "Password must contain at least one lowercase letter",
    number: "Password must contain at least one number",
  },
};

export const authenticationSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .superRefine((data, ctx) => {
    const { email, password } = data;

    // Email must be a valid email address
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      ctx.addIssue({
        path: ["email"],
        code: z.ZodIssueCode.custom,
        message: errorMessages.email,
      });
    }

    // Password must be at least 8 characters long
    if (password.length < 8) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: errorMessages.password.min,
      });
    }

    // Password must contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: errorMessages.password.uppercase,
      });
    }

    // Password must contain at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: errorMessages.password.lowercase,
      });
    }

    // Password must contain at least one number
    if (!/[0-9]/.test(password)) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: errorMessages.password.number,
      });
    }
  });

export type AuthenticationForm = z.infer<typeof authenticationSchema>;
