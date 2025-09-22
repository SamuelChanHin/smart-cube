import React, { useEffect, useState } from "react";
import type { Move } from "../types/types";
import magicCube from "../services/magic-cube";

function useCube() {
  // Observe magicCube.queue changes using a state and effect
  const [queue, setQueue] = useState<Move[]>([]);

  useEffect(() => {
    // Assume magicCube exposes an event emitter or subscribe method
    const handleQueueChange = (newQueue: Move[]) => {
      setQueue([...newQueue]);
    };

    // Example: magicCube.on('queueChange', handleQueueChange)
    // Replace with your actual subscription logic
    magicCube.subscribeQueue(handleQueueChange);
  }, []);
}

export default useCube;
