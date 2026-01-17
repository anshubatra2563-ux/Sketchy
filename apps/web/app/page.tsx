"use client";

import { useEffect, useRef } from "react";
import { createInitialState, renderScene, SceneState } from "@repo/engine";

type ToolState =
  | { type: "idle" }
  | {
      type: "drawing-rectangle";
      startX: number;
      startY: number;
      elementId: string;
    }
  | {
      type: "moving-element";
      lastX: number;
      lastY: number;
    };

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<SceneState>(createInitialState());
  //initial tool is at ideal state
  const toolRef = useRef<ToolState>({ type: "idle" });
  //this is for which element is selected
  const selectedElementRef = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();

    window.addEventListener("resize", resize);
    let running = true;
    function loop() {
      if (!running) return;
      renderScene(ctx!, canvas, sceneRef.current);
      requestAnimationFrame(loop);
    }
    loop();

    function isPointInsideRectangle(
      px: number,
      py: number,
      r: { x: number; y: number; width: number; height: number }
    ) {
      return (
        px >= r.x && px <= r.x + r.width && py >= r.y && py <= r.y + r.height
      );
    }
    function getWorldCoordinates(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { offsetX, offsetY, zoom } = sceneRef.current.viewport;

      return {
        x: x / zoom + offsetX,
        y: y / zoom + offsetY,
      };
    }
    function onMouseDown(e: MouseEvent) {
      const { x, y } = getWorldCoordinates(e);

      const elements = sceneRef.current.elements;
      let hit = null;
      // loop through the elements in reverse order because we want to check the topmost element first
      // earlier oldest elements are getting selected
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if (isPointInsideRectangle(x, y, el!)) {
          hit = el;
          break;
        }
      }
      if (hit) {
        toolRef.current = {
          type: "moving-element",
          lastX: x,
          lastY: y,
        };
        // i can also store the id of the selected element in this toolRef.current like this
        // toolRef.current = { type: "moving-element", startX: x, startY: y, elementId: hit.id };
        // but i want that remains selected even the the mouse is up
        // if i store the elementId in toolRef.current, it will be lost when the mouse is up
        // because i make the toolRef.current idle when the mouse is up
        // so that is why i am using the another ref selectedElementRef
        // it indicates which element is currently selected
        selectedElementRef.current = hit.id;
        return;
      }

      selectedElementRef.current = null;
      const id = crypto.randomUUID();
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
      selectedElementRef.current = id;
      toolRef.current = {
        type: "drawing-rectangle",
        startX: x,
        startY: y,
        elementId: id,
      };
    }

    function onMouseMove(e: MouseEvent) {
      const { x, y } = getWorldCoordinates(e);
      if (toolRef.current.type == "moving-element") {
        const { lastX, lastY } = toolRef.current;
        const dx = x - lastX;
        const dy = y - lastY;
        const el = sceneRef.current.elements.find(
          (el) => el.id === selectedElementRef.current
        );
        if (el) {
          el.x += dx;
          el.y += dy;
        }
        toolRef.current.lastX = x;
        toolRef.current.lastY = y;
        return;
      }
      if (toolRef.current.type == "drawing-rectangle") {
        const { startX, startY, elementId } = toolRef.current;
        const element = sceneRef.current.elements.find(
          (e) => e.id === elementId
        );
        if (!element) return;
        element.x = Math.min(startX, x);
        element.y = Math.min(startY, y);
        element.width = Math.abs(x - startX);
        element.height = Math.abs(y - startY);
      }
    }

    function onMouseUp(e: MouseEvent) {
      toolRef.current = { type: "idle" };
    }
    function onMouseWheel(e: WheelEvent) {
      //this stops browser scrooling
      e.preventDefault();

      if (e.ctrlKey) {
        const viewport = sceneRef.current.viewport;

        const zoomSpeed = 0.004;
        const MIN_ZOOM = 0.1;
        const MAX_ZOOM = 10;

        const oldZoom = viewport.zoom;
        // i have implemented these lines to Prevents insane zoom jumps
        const delta = Math.max(-100, Math.min(100, e.deltaY));
        const scale = Math.exp(-delta * zoomSpeed);

        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, oldZoom * scale));

        // Mouse position on canvas
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // World point under cursor BEFORE zoom
        const worldX = mouseX / oldZoom + sceneRef.current.viewport.offsetX;
        const worldY = mouseY / oldZoom + sceneRef.current.viewport.offsetY;

        sceneRef.current.viewport.zoom = newZoom;

        // this is necessary to keep the world point under the cursor same before adn after the zoom
        sceneRef.current.viewport.offsetY = worldY - mouseY / newZoom;
        sceneRef.current.viewport.offsetX = worldX - mouseX / newZoom;

        return;
      }

      

      const viewport = sceneRef.current.viewport;
      // i am updating the offsetX and offsetY directly and the renderScene function
      // draws different part of the world
      viewport.offsetX += e.deltaX / viewport.zoom;
      viewport.offsetY += e.deltaY / viewport.zoom;
    }

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", onMouseWheel, { passive: false });
    return () => {
      running = false;

      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("wheel", onMouseWheel);
    };
  }, []);
  return <canvas ref={canvasRef} />;
}
