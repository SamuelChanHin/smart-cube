import JEASINGS, { JEasing } from "jeasings";
import type { Mesh } from "three";
import { delay } from "utils/delay";
import type { Move } from "../types/types";

class MagicCube3DService {
  // This queue only for 3D cube rotation
  private queue: Move[] = [];

  // after push to queue, will automatically display in 3D UI
  public pushQueue(q: Move) {
    this.queue.push(q);
  }

  public async move(ref: Mesh, rotationGroup: Mesh) {
    const callback = this.move.bind(this, ref, rotationGroup);

    if (this.queue.length === 0) {
      await delay(100);
      callback();
      return;
    }

    const move = this.queue.shift()!;

    // Forward rotation for back face
    if (move === "L") {
      this.rotate(ref, rotationGroup, "x", -0.5, 1, callback);
    }
    // Reverse rotation for back face
    if (move === "L'") {
      this.rotate(ref, rotationGroup, "x", -0.5, -1, callback);
    }
    // Forward rotation for left face
    if (move === "L") {
      this.rotate(ref, rotationGroup, "x", -0.5, 1, callback);
    }
    // Reverse rotation for left face
    if (move === "L'") {
      this.rotate(ref, rotationGroup, "x", -0.5, -1, callback);
    }
    // Reverse rotation for right face
    if (move === "R") {
      this.rotate(ref, rotationGroup, "x", 0.5, -1, callback);
    }
    // Forward rotation for right face
    if (move === "R'") {
      this.rotate(ref, rotationGroup, "x", 0.5, 1, callback);
    }
    // Forward rotation for down face
    if (move === "D") {
      this.rotate(ref, rotationGroup, "y", -0.5, 1, callback);
    }
    // Reverse rotation for down face
    if (move === "D'") {
      this.rotate(ref, rotationGroup, "y", -0.5, -1, callback);
    }
    // Reverse rotation for up face
    if (move === "U") {
      this.rotate(ref, rotationGroup, "y", 0.5, -1, callback);
    }
    // Forward rotation for up face
    if (move === "U'") {
      this.rotate(ref, rotationGroup, "y", 0.5, 1, callback);
    }
    // Reverse rotation for front face
    if (move === "F") {
      this.rotate(ref, rotationGroup, "z", 0.5, -1, callback);
    }
    // Forward rotation for front face
    if (move === "F'") {
      this.rotate(ref, rotationGroup, "z", 0.5, 1, callback);
    }
    // Forward rotation for back face
    if (move === "B") {
      this.rotate(ref, rotationGroup, "z", -0.5, 1, callback);
    }
    // Reverse rotation for back face
    if (move === "B'") {
      this.rotate(ref, rotationGroup, "z", -0.5, -1, callback);
    }
  }

  public resetAll = (cubeGroup: Mesh, rotationGroup: Mesh) => {
    this.resetCubeGroup(cubeGroup, rotationGroup);
    cubeGroup.rotation.set(0, 0, 0);
    cubeGroup.children.forEach((child) => {
      child.rotation.set(0, 0, 0);
    });
  };

  // The attach to rotation group works by filtering all the boxes from the main
  // cubeGroup (cubeGroup holds the ref for the main rubiks group)
  // ccubGroup.children give us all the react objects with their properties
  // the limit and position values are used to get front or back positons, while
  // axis is x or y or z based on required face.
  // try changing the limits and axis to understand it better.
  private attachToRotationGroup = (
    cubeGroup: Mesh,
    rotationGroup: Mesh,
    axis: "x" | "y" | "z",
    limit: number
  ) => {
    cubeGroup.children
      .slice()
      .reverse()
      .filter(function (c) {
        return limit < 0 ? c.position[axis] < limit : c.position[axis] > limit;
      })
      .forEach(function (c) {
        rotationGroup.attach(c);
      });
  };

  // The resetCubeGroup function should just takes the boxes in rotation group and
  // returns them back to the main group.

  private resetCubeGroup = (cubeGroup: Mesh, rotationGroup: Mesh) => {
    rotationGroup.children
      .slice()
      .reverse()
      .forEach(function (c) {
        cubeGroup.attach(c);
      });
    rotationGroup.quaternion.set(0, 0, 0, 1);
  };

  // moveGroup just uses the animation library and rotates it by 90degress with a
  // multiplier giving speed of rotation.
  private moveGroup = (
    rotationGroup: Mesh,
    axis: "x" | "y" | "z",
    multiplier: number,
    callback: () => void
  ) => {
    new JEasing(rotationGroup.rotation)
      .to(
        {
          [axis]: rotationGroup.rotation[axis] + (Math.PI / 2) * multiplier,
        },
        100
      )
      .easing(JEASINGS.Cubic.InOut)
      .onComplete(() => {
        callback();
      })
      .start();
  };

  // This is the main function for controls when no animation is on it resets the
  // rotation group, attaches new faces to the rotation group and calls
  // move function.
  private rotate = (
    cubeGroup: Mesh,
    rotationGroup: Mesh,
    axis: "x" | "y" | "z",
    limit: number,
    multiplier: number,
    callback: () => void
  ) => {
    if (!JEASINGS.getLength()) {
      this.resetCubeGroup(cubeGroup, rotationGroup);
      this.attachToRotationGroup(cubeGroup, rotationGroup, axis, limit);
      this.moveGroup(rotationGroup, axis, multiplier, callback);
    }
  };
}

const magicCube3d = new MagicCube3DService();

export default magicCube3d;
