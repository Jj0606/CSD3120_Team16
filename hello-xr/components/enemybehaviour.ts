import { EntityComponentSystem } from "../src/ecs";
import { Behaviour } from "./behaviour";

export class EnemyBehaviour extends Behaviour {


    constructor(entity: number, ecs: EntityComponentSystem) {
        super(ecs, entity);
        
        
    }

    override Awake(): void {

    }
}