import MagicCube from "~/magic-cube";
import { FiveSecondChallengeProvider } from "~/magic-cube/providers/five-second-challenge.provider";
import { CubeProvider } from "~/magic-cube/providers/magic-cube.provider";
import { StandardChallengeProvider } from "~/magic-cube/providers/standard";
import "~/magic-cube/services/magic-cube";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Magic Cube" },
    { name: "description", content: "Welcome to the Magic Cube!" },
  ];
}

export default function Home() {
  return (
    <CubeProvider>
      <StandardChallengeProvider>
        <FiveSecondChallengeProvider>
          <MagicCube />
        </FiveSecondChallengeProvider>
      </StandardChallengeProvider>
    </CubeProvider>
  );
}
