import { ActionManager, Engine, HtmlElementTexture, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, TransformNode, Vector3, WebXRDefaultExperience, WebXRFeatureName, WebXRFeaturesManager, WebXRMotionControllerTeleportation } from "babylonjs";
import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";
import {Text, Spheres} from "../components"

export class App {
    private engine: Engine;
    private canvas: HTMLCanvasElement;

    constructor(engine: Engine, canvas: HTMLCanvasElement) {
        this.engine = engine;
        this.canvas = canvas;
        console.log('app is running');
    }

    async createXRScene(canvasID: string) 
    { 
        this.canvas.id = canvasID

        const scene = new Scene(this.engine);
        scene.actionManager = new ActionManager(scene);

        scene.createDefaultCameraOrLight(false, true,true); 
        const testText = new Text("testblock",1,0.2,450,100,new Vector3(1,0,0),"white","black",50,scene);
        new Spheres("testsphere",{diameter: 1.0}, scene, testText);



         //for the XR/VR experience
         const xr = await scene.createDefaultXRExperienceAsync({
            uiOptions: {
                sessionMode: 'immersive-vr'
            },
            optionalFeatures : true
        });
        const featureManager = xr.baseExperience.featuresManager;
        console.log(WebXRFeaturesManager.GetAvailableFeatures());

        //ground - used for teleportation [locomotion]
        const groundMaterial = new StandardMaterial("ground material", scene);
        groundMaterial.backFaceCulling = true;
        groundMaterial.diffuseTexture = new Texture('textures/floor.jpg', scene);
        const ground = MeshBuilder.CreateGround("ground", {width: 40, height: 40}, scene);
        ground.material = groundMaterial;
        ground.position.set (0,-5,8);
        
        //locomotion
        const movement = movementMode.Teleportation;
        this.initLocomotion(movement, xr, featureManager, ground,scene);
        
        //hand tracking
        try{
            featureManager.enableFeature(
            WebXRFeatureName.HAND_TRACKING,
            "latest",
            {
                xrInput: xr.input,
                jointMeshes:{ 
                    disableDefaultHandMesh: true,
                }
            }
        );
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
    initLocomotion(movement: movementMode, xr: WebXRDefaultExperience, 
        featureManager: WebXRFeaturesManager, ground: Mesh, scene: Scene)
    {
        switch(movement)
        {
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
                        defaultTargetMeshOptions:{
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
                console.log ("movement mode: Controller");
                featureManager.disableFeature(WebXRFeatureName.TELEPORTATION);
                featureManager.enableFeature(WebXRFeatureName.MOVEMENT, "latest",{
                    xrInput: xr.input,
                });
                break;
            case movementMode.Walk:
                console.log ("movement mode: Walk");
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
enum movementMode{
    Teleportation, 
    Controller,
    Walk,
}


