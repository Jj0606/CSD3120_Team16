import { LerpBlock, Vector3 } from "babylonjs";
import { EntityComponentSystem } from "../src/ecs";
import { Behaviour } from "./behaviour";
import { Cubes } from "./mesh";

export class EnemyBehaviour extends Behaviour {

    speed: number = 10;

    constructor(entity: number, ecs: EntityComponentSystem) {
        super(ecs, entity);
        
    }

    override Awake(): void {
        if(this.ecs.HasComponent("Cubes", this.entity))
        {
            let cubes = this.ecs.GetComponent<Cubes>("Cubes", this.entity);

            let target = new Vector3(0,0,0);

            cubes.position.add( target.subtract(cubes.position).normalize().scale(this.speed));
        }
    }
}