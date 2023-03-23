import { Scene, Sound } from "babylonjs";
export declare class Audio {
    testSFX: Sound;
    BGM: Sound;
    scene: Scene;
    constructor(scene: Scene);
    createSFX(soundpath: string): void;
    createBGM(soundpath: string): void;
}
