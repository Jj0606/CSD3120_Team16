import {
  ActionManager,
  BabylonFileLoaderConfiguration,
  Color4,
  Engine,
  HtmlElementTexture,
  Mesh,
  MeshBuilder,
  PointerDragBehavior,
  Scene,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector2,
  Vector3,
  WebXRDefaultExperience,
  WebXRFeatureName,
  WebXRFeaturesManager,
  WebXRMotionControllerTeleportation,
} from "babylonjs";
import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";
import { Text, Spheres, Audio, Cubes, Models, Particles } from "../components";
import {EntityComponentSystem} from "./ecs2"

import "babylonjs-loaders";

export class App {
  private engine: Engine;
  private canvas: HTMLCanvasElement;
  private ecs: EntityComponentSystem;

  constructor(engine: Engine, canvas: HTMLCanvasElement) {
    this.engine = engine;
    this.canvas = canvas;

    

    console.log("app is running");
  }

  /**
   * Update loop for the game.
   * @param scene
   */
  Update(scene : Scene)
  {
    scene.registerBeforeRender(function () {
      //Do all Game Based Updates here!
    })
  }

  async createXRScene(canvasID: string) {
    this.canvas.id = canvasID;

    const scene = new Scene(this.engine);
    scene.actionManager = new ActionManager(scene);

    /**
     * Testing new Entity Component System
     */

    this.ecs = new EntityComponentSystem();
    this.ecs.RegisterComponent<Cubes>();
    this.ecs.AddComponent<Cubes>(new Cubes("a cube", {size: 20}, scene), 0);
    this.ecs.GetComponent<Cubes>(0);

    
    

    scene.createDefaultCameraOrLight(false, true, true);

    //the following are test codes for the setups, they are to be changed
    const testText = new Text(
      "testblock",
      1,
      0.2,
      450,
      100,
      new Vector3(1, 0, 0),
      "white",
      "black",
      50,
      scene
    );
    new Spheres("testsphere", { diameter: 1.0 }, scene, testText);
    var testcube = new Cubes("testcube", { size: 1.0 }, scene);
    testcube.position.set(3, 0, 0);

    const testAudio = new Audio(scene);
    testAudio.createBGM("audio/8bit.mp3");
    testAudio.BGM.setVolume(0.3);

    const testmodels = new Models("testmodels", scene);
    testmodels.loadModels("H2.glb", () => {
      //ADD BEHAVIOURS HERE
      const h20modelGrab = new PointerDragBehavior({
        dragPlaneNormal: Vector3.Backward(),
      });
      testmodels.mesh.addBehavior(h20modelGrab);
      new Particles(
        testmodels.mesh.position,
        new Color4(0.7, 0.8, 1.0, 1.0),
        new Color4(0.3, 0.5, 1.0, 1.0),
        new Vector2(0.01, 0.05),
        new Vector2(0.3, 1.5),
        1500,
        new Vector3(-1, 8, 1),
        new Vector3(1, 8, -1),
        new Vector2(0.2, 0.8),
        0.01,
        scene
      );
      console.log("Model loaded!");
    });

    

    //for the XR/VR experience
    const xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: "immersive-vr",
      },
      optionalFeatures: true,
    });
    const featureManager = xr.baseExperience.featuresManager;
    console.log(WebXRFeaturesManager.GetAvailableFeatures());

    //ground - used for teleportation [locomotion]
    const groundMaterial = new StandardMaterial("ground material", scene);
    groundMaterial.backFaceCulling = true;
    groundMaterial.diffuseTexture = new Texture("textures/floor.jpg", scene);
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 40, height: 40 },
      scene
    );
    ground.material = groundMaterial;
    ground.position.set(0, -5, 8);

    //locomotion
    const movement = movementMode.Teleportation;
    this.initLocomotion(movement, xr, featureManager, ground, scene);

    //hand tracking
    try {
      featureManager.enableFeature(WebXRFeatureName.HAND_TRACKING, "latest", {
        xrInput: xr.input,
        jointMeshes: {
          disableDefaultHandMesh: true,
        },
      });
      console.log("hand");
    } catch (error) {
      console.log(error);
    }

    //enabled features
    console.log(featureManager.getEnabledFeatures());

    this.Update(scene); //This is where all game loop stuff happens

    return scene;
  } //END OF CREATE XR SCENE

  /**
   * Virtually navigate the virtual environment with a locomotion method
   * @param movement
   * @param xr
   * @param featureManager
   * @param ground
   * @param scene
   */
  initLocomotion(
    movement: movementMode,
    xr: WebXRDefaultExperience,
    featureManager: WebXRFeaturesManager,
    ground: Mesh,
    scene: Scene
  ) {
    switch (movement) {
      case movementMode.Teleportation:
        console.log("movement mode: teleportation");
        const teleportation = featureManager.enableFeature(
          WebXRFeatureName.TELEPORTATION,
          "stable",
          {
            xrInput: xr.input,
            floorMeshes: [ground],
            timeToTeleport: 2000,
            useMainComponentOnly: true,
            defaultTargetMeshOptions: {
              teleportationFillColor: "#55FF99",
              teleportationBorderColor: "Blue",
            },
          },
          true,
          true
        ) as WebXRMotionControllerTeleportation;
        teleportation.parabolicRayEnabled = true;
        teleportation.parabolicCheckRadius = 2;
        break;
      case movementMode.Controller:
        console.log("movement mode: Controller");
        featureManager.disableFeature(WebXRFeatureName.TELEPORTATION);
        featureManager.enableFeature(WebXRFeatureName.MOVEMENT, "latest", {
          xrInput: xr.input,
        });
        break;
      case movementMode.Walk:
        console.log("movement mode: Walk");
        featureManager.disableFeature(WebXRFeatureName.TELEPORTATION);
        const xrRoot = new TransformNode("xr root", scene);
        xr.baseExperience.camera.parent = xrRoot;
        featureManager.enableFeature(
          WebXRFeatureName.WALKING_LOCOMOTION,
          "latest",
          {
            locomotionTarget: xrRoot,
          }
        );
        break;
    }

    
  }
} //END OF EXPORT CLASS

/**
 * Enums for different movement
 * For this project currenly only teleportation is in used
 */
enum movementMode {
  Teleportation,
  Controller,
  Walk,
}
