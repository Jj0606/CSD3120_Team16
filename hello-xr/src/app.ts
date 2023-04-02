import {
  ActionManager,
  Animation,
  CannonJSPlugin,
  Color4,
  Engine,
  HtmlElementTexture,
  Mesh,
  MeshBuilder,
  PhysicsImpostor,
  PointerDragBehavior,
  RandomNumberBlock,
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
import { AdvancedDynamicTexture, TextBlock, } from "babylonjs-gui";
import { Text, Spheres, Audio, Cubes, Models, Particles } from "../components";
import "babylonjs-loaders";
var timer = 0;
var intervalId;
var timeoutId;

export class App {
  private engine: Engine;
  private canvas: HTMLCanvasElement;
  
  constructor(engine: Engine, canvas: HTMLCanvasElement) {
    this.engine = engine;
    this.canvas = canvas;
    console.log("app is running");
  }

  async createXRScene(canvasID: string) {
    this.canvas.id = canvasID;

    const scene = new Scene(this.engine);
    scene.actionManager = new ActionManager(scene);

    scene.createDefaultCameraOrLight(false, true, true);
    scene.activeCamera.position = new Vector3(0,0, -5)

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
    // new Spheres("testsphere", { diameter: 1.0 }, scene, testText);
    // var testcube = new Cubes("testcube", { size: 1.0 }, scene);
    // testcube.position.set(3, 0, 0);

    const testAudio = new Audio(scene);
    testAudio.createBGM("audio/8bit.mp3");
    testAudio.BGM.setVolume(0.3);

    const testmodels = new Models("testmodels", scene);
    testmodels.loadModels("bomb.glb", () => {
      //ADD BEHAVIOURS HERE
      const h20modelGrab = new PointerDragBehavior({
        dragPlaneNormal: Vector3.Backward(),
      });
      testmodels.mesh.addBehavior(h20modelGrab);
      console.log("Model loaded!");
    });
    testmodels.loadModels("apple.glb", () => {
      //ADD BEHAVIOURS HERE
      const h20modelGrab = new PointerDragBehavior({
        dragPlaneNormal: Vector3.Backward(),
      });
      testmodels.mesh.addBehavior(h20modelGrab);

    });
    testmodels.loadModels("banana.glb", () => {
      //ADD BEHAVIOURS HERE
      const h20modelGrab = new PointerDragBehavior({
        dragPlaneNormal: Vector3.Backward(),
      });
      testmodels.mesh.addBehavior(h20modelGrab);

    });
    testmodels.loadModels("orange.glb", () => {
      //ADD BEHAVIOURS HERE
      const h20modelGrab = new PointerDragBehavior({
        dragPlaneNormal: Vector3.Backward(),
      });
      testmodels.mesh.addBehavior(h20modelGrab);

    });

    const plate = MeshBuilder.CreateCylinder('plate', {
      height: 0.05,
      diameter: 1.5
    }, scene);

    plate.position = new Vector3(0,0,0);
    const plateDrag = new PointerDragBehavior({
      dragPlaneNormal: new Vector3(0,1,0)
    })
    plate.addBehavior(plateDrag)
    
    spawnFruit(scene, testmodels)

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
    
    //TIMER STUFF HERE
    intervalId = setInterval(function() {
      timer++;
      testText.textBlock.text = ("Timer: " + timer);
      console.log("Timer: " + timer);
    }, 1000);

    scene.registerBeforeRender( () => {
      const delta = scene.deltaTime | 0
      for (let mesh of scene.meshes) {
        if (mesh.name == "New Fruit" && !mesh.parent) {
          mesh.position.y -= 3.0 * delta / 1000
          //console.log(scene.deltaTime)
        }
      }
    })

    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      testText.textBlock.text = ("Times Up!");
    }, 10000);
 
  
    window.addEventListener('keydown',e => {
      if (e.key === 'r')
      {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        timer = 0;
        intervalId = setInterval(function() {
          timer++;
          testText.textBlock.text = ("Timer: " + timer);
          console.log("Timer: " + timer);
        }, 1000);
    
        timeoutId = setTimeout(() => {
          clearInterval(intervalId);
          testText.textBlock.text = ("Times Up!");
        }, 10000);
     
      }
  });
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
        for (const mesh of scene.meshes) {
          if (mesh.name !== "ground") {
            teleportation.addBlockerMesh(mesh)
          }
      }
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

function spawnFruit(scene: Scene, models : Models) {
  const fruitArray = Array("apple.glb", "banana.glb", "orange.glb")

  const fruitType = Math.floor(Math.random() * 3)
  const fruitName = fruitArray[fruitType]
  models.loadModels(fruitName, () => {
    //ADD BEHAVIOURS HERE
    models.mesh.name = "New Fruit"
    const randX = Math.random() * 10 - 5;
    const randZ = Math.random() * 10 - 5;
    //const randX = 0
    //const randZ = 5
    console.log(randX, randZ)
    models.mesh.position = new Vector3(randX, 10, randZ)
  });
}