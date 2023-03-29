import { Scene, Texture, Vector3 } from "babylonjs";
import { Text, Spheres, Audio, Cubes, Models, Particles, Meshes } from "../components";

export class EntityComponentSystem
{
    maxEntities: number = 2000;

    //Add ur component arrays here! Rmb to add a signature for components to enum Signatures!
    allMeshes: Meshes[] = new Array(this.maxEntities);
    allModels: Models[] = new Array(this.maxEntities);
    allParticles: Particles[] = new Array(this.maxEntities);
    allAudio: Audio[] = new Array(this.maxEntities);
    allText: Text[] = new Array(this.maxEntities);
    allTextures: Texture[] = new Array(this.maxEntities);

    entities: boolean[] = new Array(this.maxEntities); //this represents available entities
    allbitsets: Uint16Array = new Uint16Array(this.maxEntities); //this is bitset per entity

    //Scene
    scene : Scene;

    constructor(scene: Scene)
    {
        this.scene = scene;
        
        for(let i = 0; i < this.maxEntities; i++)
        {
            this.entities[i] = false;
        }

        this.InitAllObjects(this.scene);
    }


    public AddComponent<T>(entity: number, component: T)
    {
        if(component instanceof Spheres)
        {
            this.allMeshes[entity] = component as Meshes;
            this.SetBitset(Signatures.MESHES, entity);
            console.log("Added Sphere to entity: " + entity.toString());
        }

        else if(component instanceof Cubes)
        {
            this.allMeshes[entity] = component as Meshes;
            this.SetBitset(Signatures.MESHES, entity);
            console.log("Added Cube to entity: " + entity.toString());
        }
        
        else
        {
            console.log("Component type not found! Did you register beforehand?");
            //throw new Error("Component type not found! Did you register beforehand?");
        }
    }

    public RemoveComponent(entity: number, component: any)
    {
        if(component instanceof Spheres)
        {
            this.allMeshes[entity] = component as Meshes;
            this.UnsetBitset(Signatures.MESHES, entity);
        }
        
        else
        {
            console.log("Component type not found! Did you register beforehand?");
            //throw new Error("Component type not found! Did you register beforehand?");
        }
    }

    SetBitset(signature: Signatures, entity: number)
    {
        this.allbitsets[entity] |= signature;
    }

    UnsetBitset(signature: Signatures, entity: number)
    {
        this.allbitsets[entity] &= signature;
    }

    public MakeEntity() : number
    {
        for(let i = 0; i < this.maxEntities; ++i)
        {
            if(this.entities[i] == false)
            {
                this.entities[i] = true;
                return i;
            }
        }

        throw new Error("Max Entities of 2000 Reached!");
    }

    InitAllObjects(scene: Scene)
    {
        var testmesh = this.MakeEntity();
        this.AddComponent<Cubes>(testmesh, new Cubes("testcube1", { size: 1.0 }, scene));
    }

}


enum Signatures{
    MESHES =    0b0000000000000001,
    PARTICLES = 0b0000000000000010
}

