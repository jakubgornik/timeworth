import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sparklesVariants } from "@/lib/animations/animation-variants";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function LoginFormCardHeader() {
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <motion.div animate="animate" variants={sparklesVariants}>
          <Sparkles className="h-5 w-5" />
        </motion.div>
        <h1>Login into app</h1>
      </CardTitle>
      <CardDescription className="text-center">
        Enter your email and password to login
      </CardDescription>
    </CardHeader>
  );
}
