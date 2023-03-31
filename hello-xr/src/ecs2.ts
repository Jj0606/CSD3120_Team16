import { Scene, Texture, Vector3 } from "babylonjs";
import { Text, Spheres, Audio, Cubes, Models, Particles, Meshes } from "../components";

type Entity = number;

export class EntityComponentSystem
{
    maxEntities = 200;
    maxComponents = 32;

    arrayOfComponentArrays: ComponentArray[] = new Array(this.maxComponents);
    entityBitSets: Uint32Array = new Uint32Array(this.maxEntities).fill(0);

    componentBitSets: Uint32Array = new Uint32Array(this.maxComponents).fill(0);


    numberOfComponents = 0;

    RegisterComponent<T>()
    {
        //Create new component array of type T and push into array of Component Arrays
        //might need to cast
        let thisComponentArray = new IComponentArray<T>(this.maxEntities) as ComponentArray;
        this.arrayOfComponentArrays[this.numberOfComponents] = thisComponentArray;
        this.numberOfComponents++;
        //I don't know how to get the name of T, so that I can assign a bitset...
        let type = (typeof T).name;
    }

    MakeEntity(): Entity
    {
        //goes through entity list and finds an entity with bitset all 0. 
        //if it has no components, its not doing anything and is free to be used.
        for(let i = 0; i < this.entityBitSets.length; i++)
        {
            if(this.entityBitSets[i] == 0)
            {
                console.log("Entity " + i + " created!")
                return i;
            }
        }

        return -1;
    }

    AddComponent<T>(component: T, entity: Entity)
    {   
        for(let i = 0; i < this.arrayOfComponentArrays.length; ++i)
        {
            if(this.arrayOfComponentArrays[i] instanceof IComponentArray<T>)
            {
                console.log("Added Component to Entity " + entity);
                this.arrayOfComponentArrays[i][entity] = component; //might fail here
            }
        }
    }

    GetComponent<T>(entity: Entity) : T
    {
        for(let i = 0; i < this.arrayOfComponentArrays.length; ++i)
        {
            if(this.arrayOfComponentArrays[i] instanceof IComponentArray<T>)
            {
                console.log("Retrieving Component of Entity " + entity);
                return this.arrayOfComponentArrays[i][entity] as T;
            }
        }
        throw new Error("Component not found!");
    }
}

class ComponentArray
{

}


class IComponentArray<T> extends ComponentArray
{
    public array: T[];

    constructor(maxEntities: Entity)
    {
        super();
        this.array = new Array(maxEntities);
    }
}

