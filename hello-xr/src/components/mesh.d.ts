import { AbstractMesh, Mesh, Observable, Scene } from "babylonjs";
import { Text } from "./text";
export interface Meshes {
    scene: Scene;
    mesh: Mesh;
    label: Text;
    onIntersectObservable: Observable<boolean>;
    onDistanceChangeOberservable: Observable<number>;
}
export declare class Spheres extends AbstractMesh implements Meshes {
    scene: Scene;
    mesh: Mesh;
    label: Text;
    onIntersectObservable: Observable<boolean>;
    onDistanceChangeOberservable: Observable<number>;
    constructor(name: string, options: {
        diameter: number;
    }, scene: Scene, text: Text);
}
export declare class Cubes extends AbstractMesh implements Meshes {
    scene: Scene;
    mesh: Mesh;
    label: Text;
    onIntersectObservable: Observable<boolean>;
    onDistanceChangeOberservable: Observable<number>;
    constructor(name: string, options: {
        size: number;
    }, scene: Scene);
}
