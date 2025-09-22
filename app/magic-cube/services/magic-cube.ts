import type { Move } from "../types/types";
import magicCube3d from "./magic-cube-3d";

class MagicCube {
  private complated: boolean = false;
  private queue: Move[] = [];

  private stepCount: number = 0;
  private isCounting: boolean = false;
  private isLocked: boolean = false;
  private isEarlyMove: boolean = false;
  private subscribeQueueCallbacks: (newQueue: Move[]) => void = () => undefined;

  constructor() {}

  subscribeQueue(callback: (newQueue: Move[]) => void) {
    this.subscribeQueueCallbacks = callback;
  }

  public pushQueue(q: Move) {
    magicCube3d.pushQueue(q); // For UI 3D cube

    this.queue.push(q);
    this.subscribeQueueCallbacks(this.queue);

    if (this.isCounting) {
      this.stepCount += 1;
    }

    if (this.isLocked) {
      this.isEarlyMove = true;
    }
  }

  public clearQueue() {
    this.queue = [];
    this.subscribeQueueCallbacks(this.queue);
  }

  // Status
  public updateCompleteness(bool: boolean) {
    this.complated = bool;
  }

  public isComplete() {
    return this.complated;
  }

  public lock() {
    this.isLocked = true;
  }
  public isMoving() {
    return this.isEarlyMove;
  }

  // For Step Counting
  public start() {
    this.isCounting = true;
    this.isLocked = false;
    this.stepCount = 0;
  }
  public stopCount() {
    this.isCounting = false;
    this.isEarlyMove = false;
  }
  public resetCount() {
    this.isCounting = false;
    this.stepCount = 0;
    this.isLocked = false;
    this.isEarlyMove = false;
  }
  public getCounter() {
    return this.stepCount;
  }
}

export default new MagicCube();
