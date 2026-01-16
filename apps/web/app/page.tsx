"use client";

import { useEffect,useRef } from "react";
import { createInitialState,renderScene,SceneState} from "@repo/engine";

type ToolState = 
  { type : "idle"}
  |{
      type: "drawing-rectangle";
      startX: number;
      startY: number;
      elementId : string;
    }
  |{ type : "panning-trackpad"}  


export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement|null>(null)
  const sceneRef = useRef<SceneState>(createInitialState())
  //initial tool is at ideal state
  const toolRef  = useRef<ToolState>({type:"idle"})

  useEffect(() => {
    const canvas  = canvasRef.current!
    const ctx  = canvas.getContext("2d")

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    window.addEventListener("resize",resize)
    let running = true
    function loop() {
      if(!running) return
      renderScene(ctx!,canvas,sceneRef.current)
      requestAnimationFrame(loop)
    }
    loop()

    function getWorldCoordinates(e:MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const x= e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { offsetX,offsetY,zoom } = sceneRef.current.viewport

      return {
        x: x/zoom + offsetX,
        y: y/zoom + offsetY
      }
    }
    function onMouseDown(e:MouseEvent) {
      const { x,y } = getWorldCoordinates(e)

      const id = crypto.randomUUID()
      sceneRef.current.elements.push({
        id,
        type: "rectangle",
        x,
        y,
        width: 0,
        height: 0,
        fillColor: "red",
        strokeColor: "blue",
      });
      toolRef.current = {
        type: "drawing-rectangle",
        startX: x,
        startY: y,
        elementId: id,
      };
    }

    function onMouseMove(e:MouseEvent) {
      if(toolRef.current.type !=="drawing-rectangle") return

      const { x,y } = getWorldCoordinates(e)
      const { startX ,startY,elementId } = toolRef.current

      const element = sceneRef.current.elements.find((e) => e.id === elementId)
      if(!element) return
      element.x = Math.min(startX, x);
      element.y = Math.min(startY, y);
      element.width = Math.abs(x - startX)
      element.height = Math.abs(y - startY)
    }

    function onMouseUp(e:MouseEvent) {
      toolRef.current = {type:"idle"}
    }
    function onMouseWheel(e:WheelEvent) {
      //this stops browser scrooling
      e.preventDefault();

      if(e.ctrlKey) return;

      toolRef.current = {type:"panning-trackpad"}

      const viewport = sceneRef.current.viewport
      // i am updating the offsetX and offsetY directly and the renderScene function
      // draws different part of the world
      viewport.offsetX += e.deltaX / viewport.zoom;
      viewport.offsetY += e.deltaY / viewport.zoom;

    }



    canvas.addEventListener("mousedown", onMouseDown)
    canvas.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup",onMouseUp)
    canvas.addEventListener("wheel",onMouseWheel)
    return () => {
      running = false

      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("wheel", onMouseWheel);
    };

  },[])
  return <canvas ref={canvasRef}/>
}