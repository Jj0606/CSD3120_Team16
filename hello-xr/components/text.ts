
/**
 * @file sound.ts
 * @author [Jolyn Wong, Leonard Koh, Pho Kai Ting, Denise Goh, Yu Ching Yin, Javin Ong J-Min, Nurul Dania Binte Mohd Rizal]
 * @desc Contains information for creation of Text that are loaded in when being imported in another class
 */

import { Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";

/**
 * Class for text
 * This text upon construction,creates a new text object
 */
export class Text {
  public textBlock: TextBlock;
  public mesh: Mesh;

/**
 * Constructor for text
 * @param name 
 * @param width 
 * @param height 
 * @param meshwidth 
 * @param meshheight 
 * @param pos 
 * @param bgColour 
 * @param textColour 
 * @param fontsize 
 * @param scene 
 */

  constructor(
    name: string,
    width: number,
    height: number,
    meshwidth: number,
    meshheight: number,
    pos: Vector3,
    bgColour: string,
    textColour: string,
    fontsize: number,
    scene: Scene) 
  {
    const helloPlane = MeshBuilder.CreatePlane(name + "hello plane", {
      width: width,
      height: height,
    });

    helloPlane.position.set(pos.x, pos.y, pos.z);
    const helloTexture = AdvancedDynamicTexture.CreateForMesh(
      helloPlane,
      meshwidth,
      meshheight,
      false
    );

    helloTexture.background = bgColour;
    const helloText = new TextBlock(name);
    helloText.text = name;
    helloText.color = textColour;
    helloText.fontSize = fontsize;
    helloTexture.addControl(helloText);
    this.textBlock = helloText;
    this.mesh = helloPlane;
  }
}
