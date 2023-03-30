import { Scene, Texture, Vector3 } from "babylonjs";
import { Text, Spheres, Audio, Cubes, Models, Particles, Meshes } from "../components";

type Entity = number;



export class EntityComponentSystem
{
    maxEntities = 2000;
    maxComponents = 32;

    arrayOfComponentArrays: ComponentArray[] = new Array(this.maxComponents);
    entityBitSets: Uint32Array = new Uint32Array(this.maxEntities);
    componentBitSets: Uint32Array = new Uint32Array(this.maxComponents);

    numberOfComponents = 0;

    RegisterComponent<T>()
    {
        //Create new component array of type T and push into array of Component Arrays
        //might need to cast
        let thisComponentArray = new IComponentArray<T>(this.maxEntities) as ComponentArray;
        this.arrayOfComponentArrays[this.numberOfComponents] = thisComponentArray;
        this.numberOfComponents++;
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

