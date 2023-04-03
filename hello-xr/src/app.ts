/**
 * @file app.ts
 * @author [Jolyn Wong, Leonard Koh, Pho Kai Ting, Denise Goh, Yu Ching Yin]
 * @desc Contains information for the class App that contains function to createXR
 */

import {
  ActionManager,
  Color3,
  Engine,
  Mesh,
  MeshBuilder,
  PointerDragBehavior,
  Scene,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector3,
  WebXRDefaultExperience,
  WebXRFeatureName,
  WebXRFeaturesManager,
  WebXRMotionControllerTeleportation,
  GizmoManager,
  CubeTexture,
  AbstractMesh,
} from "babylonjs";
import {  TextBlock, } from "babylonjs-gui";
import { Text, Audio, Models } from "../components";
import "babylonjs-loaders";

//Variable Decalaration here
var timer = 0;
var score = 0;
var offset = 0;
var intervalId;
var timeoutId;
var fruitInterval;

/**
 * @class App 
 * @desc An application class that can be imported in another file
 */
export class App {
  private engine: Engine;
  private canvas: HTMLCanvasElement;
  
  /**
     * Class constructor for an application
     * @param engine An engine object
     * @param canvas An HTML canvas element
     */
  constructor(engine: Engine, canvas: HTMLCanvasElement) {
    this.engine = engine;
    this.canvas = canvas;
    console.log("app is running");
  }
  /**
     * Renders the interactive AR/VR scene when user clicks the "XR Format" button in
     * the XRAuthor interface
     * @param canvasID is the string ID of the HTMLCanvasElement target to render the scene into
     */
  async createXRScene(canvasID: string) {
    this.canvas.id = canvasID;

    const scene = new Scene(this.engine);
    scene.actionManager = new ActionManager(scene);

    //DEFAULT CAMERA AND LIGHT
    scene.createDefaultCameraOrLight(false, true, true);
    scene.activeCamera.position = new Vector3(0, 1, -10)

    //TEXT PLANES
    const scoreText = new Text(
      "Score: 0",
      1,
      0.2,
      450,
      100,
      new Vector3(0, 1, 0),
      "transparent",
      "black",
      50,
      scene
    );
    const timerText = new Text(
      "Timer: 0",
      1,
      1,
      450,
      450,
      new Vector3(0, 1.5, 0),
      "transparent",
      "cyan",
      100,
      scene
    );

    //creating skybox 
    this.createSkyBox(scene);

    //create models
    const model = new Models("testmodels", scene);
    
    //create plate
    const plate = MeshBuilder.CreateCylinder('plate', {
      height: 0.05,
      diameter: 1.5
    }, scene);
    plate.position = new Vector3(0,0,-1);
    const plateDrag = new PointerDragBehavior({
      dragPlaneNormal: new Vector3(0,0,1)
    })
    plate.addBehavior(plateDrag)
    const plateMaterial = new StandardMaterial("plateMaterial", scene); //create material
    plateMaterial.diffuseColor = new Color3(0.8, 0.53, 0);
    plate.material = plateMaterial; //apply the material to the plate mesh

    //create reset button
    this.createRestartButton(scene, plate, model, scoreText, timerText);
    
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

    scene.registerBeforeRender( () => {
      const delta = scene.deltaTime | 0
      for (let mesh of scene.meshes) {
        if ((mesh.name == "New Fruit" || mesh.name == "Bomb") && !mesh.parent) {
          mesh.position.y -= 3.0 * delta / 1000
        }
      }
    })

    //combine
    scene.registerBeforeRender( () => {
      for (let mesh of scene.meshes) {
        if ((mesh.name == "New Fruit" || mesh.name == "Bomb") && !mesh.parent) {
          //check for intersection then combine
          combine(scene, plate, mesh, offset,scoreText.textBlock); 
        }
      }
    })
    
    //TIMER STUFF HERE
    intervalId = setInterval(function() {
      timer++;
      timerText.textBlock.text = ("Timer: " + timer);
      console.log("Timer: " + timer);
    }, 1000);

    fruitInterval = setInterval(spawnFruit, 1000, scene, model)
  
    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      clearInterval(fruitInterval);
      timerText.textBlock.text = ("Times Up!");
    }, 30000);

    //RESET KEY
    window.addEventListener('keydown',e => {
      if (e.key === 'r')
      {
        timer = 0;
        score = 0;
        offset = 0;
        clearTimeout(timeoutId);
        clearInterval(fruitInterval);
        clearInterval(intervalId);
        model.loadModels("bomb.glb", () => {
          model.mesh.position = plate.position.add(new Vector3(0,1,0)) 
          model.mesh.name = "Bomb"
        });

        scoreText.textBlock.text = "Score: " + score; // update the score text

        intervalId = setInterval(function() {
          timer++;
          timerText.textBlock.text = ("Timer: " + timer);
          console.log("Timer: " + timer);
        }, 1000);

        fruitInterval = setInterval(spawnFruit, 1000, scene, model)

        timeoutId = setTimeout(() => {
          clearInterval(intervalId);
          clearInterval(fruitInterval);
          timerText.textBlock.text = ("Times Up!");
        }, 30000);      
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

    let mesh: AbstractMesh;
    xr.input.onControllerAddedObservable.add((controller) => {
        controller.onMotionControllerInitObservable.add((motionController) => {
            const trigger = motionController.getComponentOfType("trigger");
            trigger.onButtonStateChangedObservable.add(() => {
                if (trigger.changes.pressed) {
                    if (trigger.pressed) {
                        if (mesh = xr.pointerSelection.getMeshUnderPointer(controller.uniqueId)) {
                            console.log(mesh.name)
                        }
                    }
                }
            })
        })
    })

    //enabled features
    console.log(featureManager.getEnabledFeatures());

    //DEBUGGING SHORTCUTS
    this.addGizmosKeyboardShortcut(scene); 

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

  /**
   * Add Gizmos shortcut to open inspector
   * @param scene 
   */
  addGizmosKeyboardShortcut(scene: Scene) {
    const gizmoManager = new GizmoManager(scene);
    window.addEventListener('keydown', e=> {
        if(e.key == 'w'){
            gizmoManager.positionGizmoEnabled = !gizmoManager.positionGizmoEnabled;
        }
        if(e.key == 'e'){
            gizmoManager.scaleGizmoEnabled = !gizmoManager.scaleGizmoEnabled; 
        }
        if(e.key == 'o'){
            gizmoManager.rotationGizmoEnabled = !gizmoManager.rotationGizmoEnabled;
        }
        if(e.key == 'q'){
            gizmoManager.boundingBoxGizmoEnabled = !gizmoManager.boundingBoxGizmoEnabled;
        }
    })
  }
  createSkyBox(scene:Scene)
  {
      const skybox = MeshBuilder.CreateBox('skybox',{size:1000},scene);
      const skyboxMaterial = new StandardMaterial('skybox-mat');
     // console.log('skybox');

     skyboxMaterial.backFaceCulling= false;
     skyboxMaterial.reflectionTexture = new CubeTexture('textures/skybox',scene);
     skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
     skyboxMaterial.diffuseColor = new Color3(0,0,0);
     skyboxMaterial.specularColor = new Color3(0,0,0);
     skybox.material = skyboxMaterial;

  }

  createRestartButton(scene:Scene, plate: Mesh, model: Models, scoreText:Text, timerText:Text) {
    const resetButton = new Text(
      "↻",
      0.3,
      0.3,
      100,
      100,
      new Vector3(0.5, 1, 0),
      "white",
      "black",
      50,
      scene
    );
    resetButton.textBlock.onPointerDownObservable.add(() => {
      timer = 0;
      score = 0;
      offset = 0;
      clearTimeout(timeoutId);
      clearInterval(fruitInterval);
      clearInterval(intervalId);
      model.loadModels("bomb.glb", () => {
        model.mesh.position = plate.position.add(new Vector3(0,1,0)) 
        model.mesh.name = "Bomb"
      });

      scoreText.textBlock.text = "Score: " + score; // update the score text

      intervalId = setInterval(function() {
        timer++;
        timerText.textBlock.text = ("Timer: " + timer);
        console.log("Timer: " + timer);
      }, 1000);

      fruitInterval = setInterval(spawnFruit, 1000, scene, model)

      timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        clearInterval(fruitInterval);
        timerText.textBlock.text = ("Times Up!");
      }, 30000);  
    })
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

/**
 * Function that spawns fruits at random
 * @param scene 
 * @param models 
 */
function spawnFruit(scene: Scene, models : Models) {
  const fruitArray = Array("apple.glb", "banana.glb", "orange.glb", "bomb.glb")

  const fruitType = Math.floor(Math.random() * 4)
  const fruitName = fruitArray[fruitType]
  models.loadModels(fruitName, () => {
    //ADD BEHAVIOURS HERE
    if (fruitName == "bomb.glb") {
      models.mesh.name = "Bomb"
    }
    else {
      models.mesh.name = "New Fruit"
    }
    
    //RANDOMIZED THE POSITION SPAWNED FOR FRUITS
    const randX = Math.random() * 7;
    models.mesh.position = new Vector3(randX - 3.5, 10, -1)
  });
}

/**
 * function for combining mechanic
 * @param scene 
 * @param plate 
 * @param models 
 * @param offsetY 
 * @param scoreText 
 */
function combine(scene: Scene, plate: Mesh, models: AbstractMesh, offsetY : number, scoreText: TextBlock) {
  if (models) {
    const isIntersecting = models.intersectsMesh(plate, true, true);  
    if (isIntersecting) {
      if (models.name == "New Fruit") {
        offsetY += plate.scaling.y/4;
        const offset = new Vector3(Math.random() - 0.5, offsetY, Math.random() - 0.5);
        //SCORING SYSTEM HERE
        score++; // increment the score
        scoreText.text = "Score: " + score; // update the score text
        models.parent = plate;
        models.position = offset;
      }
      if (models.name == "Bomb") {
        //RESETS THE SCORE
        score = 0;
        scoreText.text = "Score: " + score; // update the score text
        for (let mesh of scene.meshes) {
          if (mesh.name == "New Fruit") {
            mesh.dispose();
          }
        }
      }
    }
  }
}
