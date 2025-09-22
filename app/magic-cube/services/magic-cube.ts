import type { Move } from "../types/types";
import magicCube3d from "./magic-cube-3d";

class MagicCube {
  // private stepCount: number = 0;
  // private isCounting: boolean = false;
  // private isLocked: boolean = false;
  // private isEarlyMove: boolean = false;

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
    qs.forEach(this.pushQueue);
  }

  public pushQueue(q: Move) {
    magicCube3d.pushQueue(q); // For UI 3D cube

    this.queue.push(q);
    this.subscribeQueueCallbacks.forEach((callback) => callback(q));
  }

  public clearQueue() {
    this.queue = [];
  }

  // public lock() {
  //   this.isLocked = true;
  // }
  // public isMoving() {
  //   return this.isEarlyMove;
  // }

  // // For Step Counting
  // public start() {
  //   this.isCounting = true;
  //   this.isLocked = false;
  //   this.stepCount = 0;
  // }
  // public stopCount() {
  //   this.isCounting = false;
  //   this.isEarlyMove = false;
  // }
  // public resetCount() {
  //   this.isCounting = false;
  //   this.stepCount = 0;
  //   this.isLocked = false;
  //   this.isEarlyMove = false;
  // }
  // public getCounter() {
  //   return this.stepCount;
  // }
}

export default new MagicCube();
