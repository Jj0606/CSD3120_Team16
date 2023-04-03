/**
 * @file mesh.ts
 * @author [Jolyn Wong, Leonard Koh, Pho Kai Ting, Denise Goh, Yu Ching Yin, Javin Ong J-Min, Nurul Dania Binte Mohd Rizal]
 * @desc Contains information for creation of Spheres when being imported in another class
 */

import { AbstractMesh, Mesh, MeshBuilder, Observable, Scene, StandardMaterial } from "babylonjs"
import {Text} from "./text"

/**
 * Interface for the Meshes
 */
export interface Meshes
{
    scene: Scene;
    mesh: Mesh;
    label: Text;
    onIntersectObservable : Observable<boolean>;
    onDistanceChangeOberservable: Observable<number>;
}

/**
 * @class Spheres 
 * @desc An Mesh class for spheres that can be imported in another file
 */

export class Spheres extends AbstractMesh implements Meshes
{
    scene: Scene;
    mesh: Mesh; 
    label: Text;
    onIntersectObservable : Observable<boolean>;
    onDistanceChangeOberservable: Observable<number>;

   /**
    * Class constructor for a Sphere
    * @param name 
    * @param options 
    * @param scene 
    * @param authoringData 
    */
    constructor(name: string, options :{diameter: number}, scene: Scene, text: Text)
    {
        super(name,scene);
        this.scene = scene; 
        this.mesh = MeshBuilder.CreateSphere("hello sphere mesh", options, scene);
        this.mesh.material = new StandardMaterial("hello sphere material",scene);
        this.addChild(this.mesh);
        this.label = text;
        this.addChild(this.label.mesh);         
    }
}

export class Cubes extends AbstractMesh implements Meshes
{
    scene: Scene;
    mesh: Mesh; 
    label: Text;
    onIntersectObservable : Observable<boolean>;
    onDistanceChangeOberservable: Observable<number>;

   /**
    * Class constructor for a Sphere
    * @param name 
    * @param options 
    * @param scene 
    * @param authoringData 
    */
    constructor(name: string, options :{size: number}, scene: Scene)
    {
        super(name,scene);
        this.scene = scene; 
        this.mesh = MeshBuilder.CreateBox("box mesh", options, scene);
        this.mesh.material = new StandardMaterial("box material",scene);
        this.addChild(this.mesh);     
    }
}