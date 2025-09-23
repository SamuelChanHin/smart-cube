import type { Move } from "../types/types";
import magicCube3d from "./magic-cube-3d";

class MagicCube {
  private queue: Move[] = [];
  private subscribeQueueCallbacks: ((newQueue: Move) => void)[] = [];

  constructor() {}

  // Subscribe Event
  subscribeQueue(callback: (newQueue: Move) => void) {
    this.subscribeQueueCallbacks.push(callback);
  }

  unsubscribeQueue(callback: (newQueue: Move) => void) {
    this.subscribeQueueCallbacks = this.subscribeQueueCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  // Queue
  public pushQueues(qs: Move[]) {
    for (const q of qs) {
      this.pushQueue(q); // For UI 3D cube
    }
  }

  public pushQueue(q: Move) {
    magicCube3d.pushQueue(q); // For UI 3D cube

    this.queue.push(q);
    this.subscribeQueueCallbacks.forEach((callback) => callback(q));
  }

  public clearQueue() {
    this.queue = [];
  }
}

export default new MagicCube();
