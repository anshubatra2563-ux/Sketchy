"use client";

import { useEffect, useRef } from "react";
import {
  createInitialState,
  RectangleElement,
  renderScene,
  SceneState,
  SELECTION_PADDING_PX,
  RESIZE_BOX_SIZE_PX,
} from "@repo/engine";

type ResizeHandle =
  | "resize-top-edge"
  | "resize-right-edge"
  | "resize-bottom-edge"
  | "resize-left-edge"
  | "resize-top-left-edges"
  | "resize-top-right-edges"
  | "resize-bottom-right-edges"
  | "resize-bottom-left-edges";

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
    }
  | {
      type: "resizing-element";
      elementId: string;
      handle: ResizeHandle;
      startX: number;
      startY: number;
      startRect: RectangleElement;
    };

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<SceneState>(createInitialState());
  //initial tool is at ideal state
  const toolRef = useRef<ToolState>({ type: "idle" });

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
      r: { x: number; y: number; width: number; height: number },
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

    function hitResizeBox(
      x: number,
      y: number,
      rect: RectangleElement,
    ): ResizeHandle | null {
      const zoom = sceneRef.current.viewport.zoom;
      const padding = SELECTION_PADDING_PX / zoom;
      const size = RESIZE_BOX_SIZE_PX / zoom;
      const half = size / 2;

      const left = rect.x - padding;
      const right = rect.x + rect.width + padding;
      const top = rect.y - padding;
      const bottom = rect.y + rect.height + padding;
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      const handles = [
        { name: "resize-top-left-edges", x: left, y: top },
        { name: "resize-top-edge", x: centerX, y: top },
        { name: "resize-top-right-edges", x: right, y: top },

        { name: "resize-left-edge", x: left, y: centerY },
        { name: "resize-right-edge", x: right, y: centerY },

        { name: "resize-bottom-left-edges", x: left, y: bottom },
        { name: "resize-bottom-edge", x: centerX, y: bottom },
        { name: "resize-bottom-right-edges", x: right, y: bottom },
      ] as const;

      for (const handle of handles) {
        if (
          x >= handle.x - half &&
          x <= handle.x + half &&
          y >= handle.y - half &&
          y <= handle.y + half
        ) {
          return handle.name;
        }
      }

      return null;
    }

    function onMouseDown(e: MouseEvent) {
      const { x, y } = getWorldCoordinates(e);

      const elements = sceneRef.current.elements;
      if (sceneRef.current.selectedElementId) {
        const selectedElement = elements.find(
          (el) => el.id === sceneRef.current.selectedElementId,
        );
        if (selectedElement) {
          const handle = hitResizeBox(x, y, selectedElement);
          if (handle) {
            toolRef.current = {
              type: "resizing-element",
              elementId: selectedElement.id,
              handle,
              startX: x,
              startY: y,
              startRect: { ...selectedElement },
            };
            sceneRef.current.isEditing = false;
            return;
          }
        }
      }

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
        sceneRef.current.selectedElementId = hit.id;
        toolRef.current = {
          type: "moving-element",
          lastX: x,
          lastY: y,
        };
        sceneRef.current.isEditing = true;
        return;
      }

      sceneRef.current.selectedElementId = null;
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
      sceneRef.current.selectedElementId = id;
      toolRef.current = {
        type: "drawing-rectangle",
        startX: x,
        startY: y,
        elementId: id,
      };
      sceneRef.current.isEditing = true;
    }

    function onMouseMove(e: MouseEvent) {
      const { x, y } = getWorldCoordinates(e);

      if (toolRef.current.type === "resizing-element") {
        const { elementId, handle, startRect, startX, startY } =
          toolRef.current;

        const el = sceneRef.current.elements.find((el) => el.id === elementId);
        if (!el) return;

        const dx = x - startX;
        const dy = y - startY;

        // Apply resize depending on handle
        switch (handle) {
          case "resize-right-edge": {
            const rawWidth = startRect.width + dx;

            if (rawWidth >= 0) {
              el.width = rawWidth;
            } else {
              el.x = startRect.x + startRect.width;
              el.width = Math.abs(rawWidth);

              toolRef.current = {
                ...toolRef.current,
                handle: "resize-left-edge",
                startX: x,
                startRect: { ...el },
              };
            }
            break;
          }

          case "resize-bottom-edge": {
            const rawHeight = startRect.height + dy;
            if (rawHeight >= 0) {
              el.height = rawHeight;
            } else {
              el.y = startRect.y + startRect.height;
              el.height = Math.abs(rawHeight);

              toolRef.current = {
                ...toolRef.current,
                handle: "resize-top-edge",
                startY: y,
                startRect: { ...el },
              };
            }
            break;
          }

          case "resize-left-edge": {
            const rawWidth = startRect.width - dx;
            if (rawWidth >= 0) {
              el.x = startRect.x + dx;
              el.width = rawWidth;
            } else {
              el.x = startRect.x + startRect.width;
              el.width = Math.abs(rawWidth);

              toolRef.current = {
                ...toolRef.current,
                handle: "resize-right-edge",
                startX: x,
                startRect: { ...el },
              };
            }
            break;
          }

          case "resize-top-edge": {
            const rawHeight = startRect.height - dy;
            if (rawHeight >= 0) {
              el.y = startRect.y + dy;
              el.height = rawHeight;
            } else {
              el.y = startRect.y + startRect.height;
              el.height = Math.abs(rawHeight);

              toolRef.current = {
                ...toolRef.current,
                handle: "resize-bottom-edge",
                startY: y,
                startRect: { ...el },
              };
            }
            break;
          }

          case "resize-top-left-edges": {
            const rawWidth = startRect.width - dx;
            if (rawWidth >= 0) {
              el.x = startRect.x + dx;
              el.width = rawWidth;
            } else {
              el.x = startRect.x + startRect.width;
              el.width = Math.abs(rawWidth);
            }
            const rawHeight = startRect.height - dy;
            if (rawHeight >= 0) {
              el.y = startRect.y + dy;
              el.height = rawHeight;
            } else {
              el.y = startRect.y + startRect.height;
              el.height = Math.abs(rawHeight);
            }
            break;
          }

          case "resize-top-right-edges": {
            el.width = Math.max(1, startRect.width + dx);

            const rawHeight = startRect.height - dy;
            if (rawHeight >= 0) {
              el.y = startRect.y + dy;
              el.height = rawHeight;
            } else {
              el.y = startRect.y + startRect.height;
              el.height = Math.abs(rawHeight);
            }
            break;
          }

          case "resize-bottom-right-edges": {
            el.width = Math.max(1, startRect.width + dx);
            el.height = Math.max(1, startRect.height + dy);
            break;
          }

          case "resize-bottom-left-edges": {
            const rawWidth = startRect.width - dx;
            if (rawWidth >= 0) {
              el.x = startRect.x + dx;
              el.width = rawWidth;
            } else {
              el.x = startRect.x + startRect.width;
              el.width = Math.abs(rawWidth);
            }

            el.height = Math.max(1, startRect.height + dy);
            break;
          }
        }

        return;
      }
      if (toolRef.current.type == "moving-element") {
        const { lastX, lastY } = toolRef.current;
        const dx = x - lastX;
        const dy = y - lastY;
        const el = sceneRef.current.elements.find(
          (el) => el.id === sceneRef.current.selectedElementId,
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
          (e) => e.id === elementId,
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
      sceneRef.current.isEditing = false;
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
