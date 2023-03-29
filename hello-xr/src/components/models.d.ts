import { Mesh, Observable, Scene } from "babylonjs";
export interface ModelMesh {
    mesh: Mesh;
    onIntersectObservable: Observable<boolean>;
    onDistanceChangeOberservable: Observable<number>;
}
export declare class Models implements ModelMesh {
    name: string;
    scene: Scene;
    mesh: Mesh;
    onIntersectObservable: Observable<boolean>;
    onDistanceChangeOberservable: Observable<number>;
    constructor(name: string, scene: Scene);
    loadModels(modelname: string, onComplete: () => void): void;
}
