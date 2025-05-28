import { Control, FieldPath, FieldValues } from "react-hook-form";
import { AnimatePresence } from "motion/react";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import FormInputError from "@/components/form-input-error";

interface AuthEmailInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  error?: string;
}

export default function AuthEmailFieldInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, error }: AuthEmailInputProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="example@email.com" {...field} />
          </FormControl>
          <div className="min-h-[1.5rem]">
            <AnimatePresence>
              {error && <FormInputError message={String(error)} />}
            </AnimatePresence>
          </div>
        </FormItem>
      )}
    />
  );
}
