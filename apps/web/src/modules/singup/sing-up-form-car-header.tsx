import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sparklesVariants } from "@/lib/animation-variants";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function SingUpFormCardHeader() {
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <motion.div animate="animate" variants={sparklesVariants}>
          <Sparkles className="h-5 w-5" />
        </motion.div>
        <h1>Create an account</h1>
      </CardTitle>
      <CardDescription className="text-center">
        Enter your email and password to sign up
      </CardDescription>
    </CardHeader>
  );
}
