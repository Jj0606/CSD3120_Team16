import { Color4, Scene, Vector2, Vector3 } from "babylonjs";
export declare class Particles {
    position: Vector3;
    colour1: Color4;
    colour2: Color4;
    size: Vector2;
    lifetime: Vector2;
    emitrate: number;
    direction1: Vector3;
    direction2: Vector3;
    emitpower: Vector2;
    speed: number;
    scene: Scene;
    constructor(position: Vector3, colour1: Color4, colour2: Color4, size: Vector2, lifetime: Vector2, emitrate: number, direction1: Vector3, direction2: Vector3, emitpower: Vector2, speed: number, scene: Scene);
}
