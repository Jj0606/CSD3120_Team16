import { CompareFunction, Scene, Texture, Vector3 } from "babylonjs";
import { Text, Spheres, Audio, Cubes, Models, Particles, Meshes } from "../components";
import { Controller } from "./controller";
import { EntityComponentSystem } from "../src/ecs";

/**
 * This controller will control enemy spawns.
 */
export class EnemyController extends Controller {
    numberOfEnemies: number
    mEntities: number[] = new Array()

    constructor(ecs: EntityComponentSystem, scene: Scene, numberOfEnemies: number) {
        super();

        this.ecs = ecs;
        this.scene = scene;

        this.numberOfEnemies = numberOfEnemies;

        for (let i = 0; i < numberOfEnemies; ++i) {
            let entity = this.MakeEnemy();
            let cube = this.ecs.GetComponent<Cubes>("Cubes", entity);
            cube.position.set(i * 10, 0, 0);
            this.mEntities.push(entity)
        }
    }

    override Update() {

    }

    override Exit() {

    }

    MakeEnemy(): number {
        let enemy = this.ecs.MakeEntity("Enemy");
        let cube = new Cubes("Enemy", { size: 2 }, this.scene);
        this.ecs.AddComponent<Cubes>("Cubes", cube, enemy);
        return enemy;
    }
}

