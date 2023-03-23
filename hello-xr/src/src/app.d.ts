import { Engine, Mesh, Scene, WebXRDefaultExperience, WebXRFeaturesManager } from "babylonjs";
export declare class App {
    private engine;
    private canvas;
    constructor(engine: Engine, canvas: HTMLCanvasElement);
    createXRScene(canvasID: string): Promise<Scene>;
    initLocomotion(movement: movementMode, xr: WebXRDefaultExperience, featureManager: WebXRFeaturesManager, ground: Mesh, scene: Scene): void;
}
declare enum movementMode {
    Teleportation = 0,
    Controller = 1,
    Walk = 2
}
export {};
