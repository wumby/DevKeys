import { CategoryShowcase } from "@/components/home/category-showcase";
import { GameStrip } from "@/components/home/game-strip";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <CategoryShowcase />
      <GameStrip />
    </>
  );
}
