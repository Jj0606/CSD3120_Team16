import { Scene } from "babylonjs"
import {EntityComponentSystem} from "../src/ecs"

/**
 * Base Class for Controllers. Controllers must be registered
 * AFTER Components.
 */
export class Controller
{
    ecs : EntityComponentSystem;
    scene : Scene;
    
    contructor()
    {  
       
    }

    Update()
    {
        
    }

    Exit()
    {

    }
}