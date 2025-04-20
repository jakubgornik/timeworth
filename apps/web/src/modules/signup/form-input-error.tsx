import { errorMessageVariants } from "@/lib/animation-variants";
import { motion } from "motion/react";

export default function FormInputError({
  message,
}: {
  message: string | undefined;
}) {
  return (
    <motion.div
      variants={errorMessageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <p className="text-sm font-medium text-destructive">{message}</p>
    </motion.div>
  );
}
