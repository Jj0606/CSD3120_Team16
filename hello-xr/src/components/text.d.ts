import { Mesh, Scene, Vector3 } from "babylonjs";
import { TextBlock } from "babylonjs-gui";
export declare class Text {
    textBlock: TextBlock;
    mesh: Mesh;
    constructor(name: string, width: number, height: number, meshwidth: number, meshheight: number, pos: Vector3, bgColour: string, textColour: string, fontsize: number, scene: Scene);
}
