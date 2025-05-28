import { signInTextVariants } from "@/lib/animations/animation-variants";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function LoginFormCardInfo() {
  return (
    <motion.div
      variants={signInTextVariants}
      initial="hidden"
      animate="visible"
      className="p-4 text-center text-sm flex gap-1 justify-center"
    >
      <p className="text-gray-500"> Don't have an account?</p>
      <Link to="/" className="font-medium ml-1 ">
        Sign up
      </Link>
    </motion.div>
  );
}
