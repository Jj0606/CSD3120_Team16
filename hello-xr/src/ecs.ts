import { CompareFunction, Scene, Texture, Vector3 } from "babylonjs";
import { Text, Spheres, Audio, Cubes, Models, Particles, Meshes } from "../components";

type Entity = number;

export class EntityComponentSystem {
    maxEntities = 200;
    maxComponents = 32;


    arrayOfComponentArrays: ComponentArray[] = new Array(this.maxComponents);
    entityBitSets: Uint32Array = new Uint32Array(this.maxEntities).fill(0);
    entityNames: string[] = new Array(this.maxEntities);
    componentBitSets: Uint32Array = new Uint32Array(this.maxComponents).fill(0);
    mapComponentToBitset: Map<string, number> = new Map();

    numberOfComponents = 0;

    constructor() {
        //this.maxEntities = maxEntities;
    }

    /**
     * Registers component for use in ECS in map of Component name to Bitset.
     * 
     * (Key -> Value)
     * Mesh  -> 0b0001
     * Cubes -> 0b0010
     * 
     * @param componentName Must be the same name as T, unless u want to be special and stick
     *                      with this name.
     */
    RegisterComponent<T>(componentName: string) {
        //Create new component array of type T and push into array of Component Arrays
        //might need to cast
        let thisComponentArray = new IComponentArray<T>(this.maxEntities) as ComponentArray;
        this.arrayOfComponentArrays[this.numberOfComponents] = thisComponentArray;

        //I don't know how to get the name of T, so that I can assign a bitset...
        //so we will force yall to type in the name for us
        //so that I can create a map of component Names to their bitsets
        /**
         *  (Key -> Value)
         *  Mesh  -> 0b0001
         *  Cubes -> 0b0010
         *  and so onD
         */
        let signature = 1 << this.numberOfComponents;
        this.mapComponentToBitset.set(componentName, signature);
        console.log("Registered Component " + componentName + ": Bitset " + this.mapComponentToBitset.get(componentName));
        this.numberOfComponents++;
    }

    /**
     * Makes an entity
     * @param name Master Name.
     * @returns an entity
     */
    MakeEntity(name: string): Entity {
        //goes through entity list and finds an entity with bitset all 0. 
        //if it has no components, its not doing anything and is free to be used.
        for (let i = 0; i < this.entityBitSets.length; i++) {
            if (this.entityBitSets[i] == 0) {
                console.log("Entity " + i + " created with name " + name +  "!");
                this.entityNames[i] = name;
                return i;
            }
        }

        return -1;
    }

    /**
     * Add Component to Entity
     * @param componentName Must be same as T!!!
     * @param component Component you want to add
     * @param entity Entity you want to add to component
     */
    AddComponent<T>(componentName: string, component: T, entity: Entity) {
        for (let i = 0; i < this.numberOfComponents; ++i) {
            if (this.arrayOfComponentArrays[i] instanceof IComponentArray<T>) {
                /**
                 *    01000110 -> Entity Bitset
                 * or 00000000 -> Component Bitset
                 * =  01000110 -> New Entity Bitset
                 *  
                 */
                let newentitysignature = this.entityBitSets[entity] | this.mapComponentToBitset.get(componentName);
                this.entityBitSets[entity] = newentitysignature; //update entity signature
                this.arrayOfComponentArrays[i][entity] = component; //might fail here
                console.log("Added Component " + componentName + " to Entity " + entity + ", Bitset ", + this.entityBitSets[entity]);
            }
        }
    }

    /**
     * Check if a given entity has component
     * @param componentName Name of the component type. If you registered with the same name, you
     *                      shouldnt have a problem!
     * @param entity Entity to check
     * @returns True if Entity has component, else False
     */
    HasComponent(componentName: string, entity: Entity): boolean {
        let entitySignature = this.entityBitSets[entity];
        /**
         *   01000110 -> Entity Bitset
         * & 01000000 -> Component Bitset
         * = 01000000 -> if is a number, true, return component
         *  
         */
        let entityBitset = this.entityBitSets[entity];
        let componentBitSet = this.mapComponentToBitset.get(componentName);

        console.log("Entity Bitset: " + entityBitset + " Component Bitset: " + componentBitSet);

        let result = entityBitset & componentBitSet;
        if (result) {
            console.log("Entity " + entity + " has component " + componentName);
            return true;
        }

        console.log("Component not found!");
        return false;
    }

    /**
     * Gets the Component to add to
     * @param componentName 
     * @param entity 
     * @returns 
     */
    GetComponent<T>(componentName: string, entity: Entity): T {
        for (let i = 0; i < this.numberOfComponents; ++i) {
            if (this.arrayOfComponentArrays[i] instanceof IComponentArray<T>) {
                /**
                 *   01000110 -> Entity Bitset
                 * & 01000000 -> Component Bitset
                 * = 01000000 -> if is a number, true, return component
                 *  
                 */
                let entityBitset = this.entityBitSets[entity]
                let componentBitSet = this.mapComponentToBitset.get(componentName);
                let result = entityBitset & componentBitSet;

                if (result) {
                    let component = this.arrayOfComponentArrays[i][entity] as T;
                    console.log("Retrieving Component: {" + componentName +  "} of Entity " + entity);
                    return component;
                }
                else {
                    throw new Error("Component not in entity!");
                }
            }
        }
        throw new Error("Component not registered!");
    }

    GetEntitiesBasedOnSignature(signature : number) : number[]
    {   
        let entities : number[] = Array();
        let systemBitset = signature;
        
        for(let i = 0; i < this.entityBitSets.length; ++i)
        {
            /**
             *      01010101 System Bitset
             *  &   11010111 Entity Bitset
             *  =   01010101 -> If result is same as System, Entity
             * has all the components needed to be placed into a system.
             * 
             */
            let entityBitset = this.entityBitSets[i];
            let result = systemBitset & entityBitset;

            if(result == systemBitset)
            {
                entities.push(i);
            }
        }
        return entities;
    }

    MakeBitSet(componentNameArray : string) : number
    {
        let result = 0;
        for(let i = 0; i < componentNameArray.length; ++i)
        {
            let retrievedBitset = this.mapComponentToBitset.get(componentNameArray[i]);
            if(retrievedBitset === null)
            {
                throw new Error("Component " + componentNameArray[i] + " does not exist!")
            }
            result = result | retrievedBitset;
        }
        return result;
    }

    // /**
    //  * Clones Entity by Entity. DOES NOT WORK!
    //  * @param entity Entity you want to clone
    //  * @returns 
    //  */
    // CloneEntity(entity: Entity): Entity {
    //     if (this.entityBitSets[entity] == 0) {
    //         console.log("Entity " + entity + " is empty!");
    //         return;
    //     }

    //     let name = this.entityNames[entity];
    //     let clone = this.MakeEntity(name + " Clone");

    //     this.entityBitSets[clone] = this.entityBitSets[entity];

    //     for (let i = 0; i < this.numberOfComponents - 1; ++i) {

    //         console.log("Entity Bitset: " + this.entityBitSets[entity].toString() +" ComponentBitset: " + (1 << i).toString());

    //         if (this.entityBitSets[entity] & (1 << i)) {
    //             let compArray = this.arrayOfComponentArrays[i];
    //             let cloneComponent = compArray.GetData(clone);
    //             let entityComponent = compArray.GetData(entity);
    //             let copy = structuredClone(entityComponent);
    //             console.log("Cloned Component: " + copy.toString());
    //             cloneComponent = copy;
    //         }
    //         else{
    //             console.log("Entity " + entity + " does not have component " + i);
    //         }
    //     }

    //     this.entityBitSets[clone] = structuredClone(this.entityBitSets[entity]);

    //     console.log("Entity Bitset: " + this.entityBitSets[entity] + " Clone Bitset: " + this.entityBitSets[clone] );

    //     return clone;
    // }

}



/**
 * Base Class Component Array to push into generic Array of ComponentArrays
 */
class ComponentArray {

    GetData(index: number): any {
        console.log("Parent method");
    }
}

/**
 * Derived Class Component Array that holds the array of specific component data.
 */
class IComponentArray<T> extends ComponentArray {
    public array: T[];

    constructor(maxEntities: Entity) {
        super();
        this.array = new Array(maxEntities);
    }

    override GetData(index: number): T {
        console.log("Child method");
        let data = this.array[index];
        return data;
    }

}

/**
 * Name Component
 */
class Name {
    name: string;
}

