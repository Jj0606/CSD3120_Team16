import { Scene,Sound } from "babylonjs"

export class Audio
{
    testSFX: Sound;
    BGM: Sound;
    scene: Scene;
    /**
     * Constructor for different sound
     * @param scene 
     */
    constructor(scene: Scene)
    {
        this.scene = scene;
    }

    /**
     * Creation of combination voiceline sfx
     * @param soundpath 
     */
    createSFX(soundpath: string)
    {
        this.testSFX = new Sound('music', soundpath, this.scene, null, {loop: false, autoplay:false});
    }

    /**
     * Creation of BGM
     * @param soundpath 
     */
    createBGM(soundpath: string)
    {
        this.BGM = new Sound('BGM', soundpath, this.scene, null, {loop: false, autoplay:true});
    }
}