import { Color4, ParticleSystem, Scene, Texture, Vector2, Vector3 } from "babylonjs"

export class Particles
{
    constructor(
        public position: Vector3,
        public colour1: Color4,
        public colour2: Color4,
        public size: Vector2,
        public lifetime: Vector2,
        public emitrate: number,
        public direction1: Vector3,
        public direction2: Vector3,
        public emitpower: Vector2,
        public speed :number,
        public scene: Scene
      ) {
        const particleSystem = new ParticleSystem('particles',5000,scene);
        particleSystem.particleTexture = new Texture ('textures/flare.png', scene);

        particleSystem.emitter = position;
        particleSystem.minEmitBox = new Vector3(0,0,0);
        particleSystem.maxEmitBox = new Vector3(0,0,0);

        particleSystem.color1 = colour1;
        particleSystem.color2 = colour2;
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

        particleSystem.minSize = size.x;
        particleSystem.maxSize = size.y; 

        particleSystem.minLifeTime = lifetime.x;
        particleSystem.maxLifeTime = lifetime.y;

        particleSystem.emitRate = emitrate;

        particleSystem.direction1 = direction1;
        particleSystem.direction2 = direction2;

        particleSystem.minEmitPower = emitpower.x; 
        particleSystem.maxEmitPower = emitpower.y;
        particleSystem.updateSpeed = speed;

        particleSystem.gravity = new Vector3(0,-9.8,0);
        particleSystem.start();
      }
}