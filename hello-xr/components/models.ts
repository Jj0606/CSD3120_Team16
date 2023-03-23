import { ActionManager, Color3, InterpolateValueAction, Mesh, Observable, Scene, SceneLoader, StandardMaterial, Vector3} from "babylonjs"


export interface ModelMesh {
  mesh: Mesh;
  onIntersectObservable : Observable<boolean>;
  onDistanceChangeOberservable: Observable<number>;
}

export class Models implements ModelMesh {
  mesh: Mesh;
  onIntersectObservable : Observable<boolean>;
  onDistanceChangeOberservable: Observable<number>;

  constructor(
    public name: string,
    public scene: Scene
  ) {}

  loadModels(modelname:string ,onComplete: () => void) {
    SceneLoader.ImportMeshAsync(
      "",
      "models/",
      modelname,
      this.scene
    ).then((result) => {
      this.mesh = result.meshes[0] as Mesh;
      this.mesh.name = this.name;

      const material = new StandardMaterial(modelname, this.scene);
      material.diffuseColor = Color3.White();
      this.mesh.material = material;
      onComplete();
    });
  }

}
