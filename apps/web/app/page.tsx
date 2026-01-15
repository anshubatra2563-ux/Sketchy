"use client";

import { useEffect,useRef } from "react";
import { createInitialState,renderScene,SceneState} from "@repo/engine";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement|null>(null)
  const sceneRef = useRef<SceneState>(createInitialState())

  useEffect(() => {
    const canvas  = canvasRef.current!
    const ctx  = canvas.getContext("2d")

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    window.addEventListener("resize",resize)
    sceneRef.current.elements.push({
        id: "test-1",
        type: "rectangle",
        x: 1000,
        y: 100,
        width: 300,
        height: 200,
        fillColor: "red",
        strokeColor: "blue",
      });

    function loop() {
      renderScene(ctx!,canvas,sceneRef.current)
      requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener("resize", resize);
    };

  },[])
  return <canvas ref={canvasRef}/>
}