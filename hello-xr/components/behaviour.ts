import { EntityComponentSystem } from "../src/ecs";

/**
 * Base Class Behaviour
 */
export class Behaviour
{
    ecs : EntityComponentSystem;

    Init()
    {

    }

    /**
     * Ideally push the Update Function into scene.registerBeforeRender
     */
    Awake()
    {

    }

    Exit()
    {

    }
}



