import { signInTextVariants } from "@/lib/animations/animation-variants";
import { ROUTES } from "@/routes/routes";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function SignUpFormCardInfo() {
  return (
    <motion.div
      variants={signInTextVariants}
      initial="hidden"
      animate="visible"
      className="p-4 text-center text-sm flex gap-1 justify-center"
    >
      <p className="text-gray-500">Already have an account?</p>
      <Link to={ROUTES.LOGIN} className="font-medium ml-1 ">
        Sign in
      </Link>
    </motion.div>
  );
}
