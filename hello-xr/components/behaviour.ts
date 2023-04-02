import { EntityComponentSystem } from "../src/ecs";

/**
 * Base Class Behaviour
 */
export class Behaviour
{
    ecs : EntityComponentSystem;
    entity: number;

    constructor(ecs: EntityComponentSystem, entity: number)
    {
        this.ecs = ecs;
        this.entity = entity;
    }

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



