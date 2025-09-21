import { FiveSecondChallengeProvider } from "~/mode/five-second-challenge.provider";
import type { Route } from "./+types/home";
import MagicCube from "~/cube";
import "~/services/magic-cube";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Magic Cube" },
    { name: "description", content: "Welcome to the Magic Cube!" },
  ];
}

export default function Home() {
  return (
    <FiveSecondChallengeProvider>
      <MagicCube />
    </FiveSecondChallengeProvider>
  );
}
