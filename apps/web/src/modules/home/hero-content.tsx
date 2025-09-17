import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/routes";
import { Link } from "react-router";

export default function HeroContent() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative z-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-secondary mb-6 tracking-tight">
          Make Every
          <br />
          <span className="font-medium italic  text-secondary">
            Moment
          </span>{" "}
          Count
        </h1>

        <p className="text-lg text-secondary mb-12 leading-relaxed max-w-2xl mx-auto">
          Timeworth helps you boost productivity, and achieve your goals with
          ease.
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button variant="secondary"> Get Started with Timeworth</Button>
        </Link>
      </div>
    </main>
  );
}
