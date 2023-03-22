import { Engine } from "babylonjs";
import { App } from './app';
//console.log('hello xr');

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const canvasID = 'renderCanvas';

//const ctx =  canvas.getContext('2d');
//ctx.font = '50px Arial';
//ctx.fillText('Hello XR', 50, 50);

const engine = new Engine(canvas, true);

const app = new App(engine, canvas);

// const scene = app.createScene();
// engine.runRenderLoop(() =>{ 
//     scene.render();
// });
const scene = app.createXRScene(canvasID);

scene.then(scene => {
    engine.runRenderLoop(() =>{
        scene.render();
        })
  })

  //Function where if website is resize it keeps the aspect ratio
window.addEventListener('resize',() => {
    engine.resize();
  });