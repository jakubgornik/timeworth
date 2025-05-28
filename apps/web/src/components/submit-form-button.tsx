import { Button } from "@/components/ui/button";
import {
  buttonContentVariants,
  spinnerVariants,
} from "@/lib/animations/animation-variants";
import { AnimatePresence, motion } from "motion/react";

type SubmitFormButtonProps = {
  isSubmitting: boolean;
  buttonText: string;
};

export default function SubmitFormButton({
  isSubmitting,
  buttonText,
}: SubmitFormButtonProps) {
  return (
    <motion.div className="w-full" whileTap={{ scale: 0.98 }}>
      <Button
        type="submit"
        variant="outline"
        disabled={isSubmitting}
        className="w-full"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isSubmitting ? (
            <motion.div
              key="loading"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={buttonContentVariants.loading}
              className="flex items-center justify-center"
            >
              <motion.div
                variants={spinnerVariants}
                animate="animate"
                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              />
            </motion.div>
          ) : (
            <motion.span
              key="text"
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              variants={buttonContentVariants.text}
            >
              {buttonText}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
