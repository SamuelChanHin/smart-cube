import { FiveSecondChallengeProvider } from "~/magic-cube/providers/five-second-challenge.provider";
import type { Route } from "./+types/home";
import "~/magic-cube/services/magic-cube";
import { StandardChallengeProvider } from "~/magic-cube/providers/standard";
import MagicCube from "~/magic-cube";
import { CubeProvider } from "~/magic-cube/providers/magic-cube.provider";

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
