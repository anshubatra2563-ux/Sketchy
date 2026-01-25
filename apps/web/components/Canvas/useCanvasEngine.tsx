"use client";
import { useState,useEffect, useRef } from "react";
import {
  getElementBoundingBox,
  createInitialState,
  renderScene,
  SceneState,
  SELECTION_PADDING_PX,
  RESIZE_BOX_SIZE_PX,
  Element,
} from "@repo/engine";
import { ResizeHandle, ToolState, BoxLike } from "./types";
import { ToolType, Tool, ToolBar, ToolButton } from "@/components/Toolbar";
import { MousePointer, Square, Circle, Diamond, Minus } from "lucide-react";
import { hitTest } from "./utils/hitTest";
import { getWorldCoordinates } from "./utils/coordinate";
import { applyResize } from "./utils/resize";
const LOCALSTORAGE_KEY = "scene";
const WHEEL_SAVE_DELAY = 300;
let wheelSaveTimeout: number | null = null;

function loadSceneFromLocalStorage(): SceneState {
  try {
    const data = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!data) return createInitialState();
    return JSON.parse(data) as SceneState;
  } catch (error) {
    return createInitialState();
  }
}

function saveSceneToLocalStorage(scene: SceneState) {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(scene));
}

export function useCanvasEngine() {
  const [active, setActive] = useState<ToolType>("select"); // UI state
  const activeToolRef = useRef<ToolType>("select");
  //initial tool is at ideal state
  const toolRef = useRef<ToolState>({ type: "idle" });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<SceneState>(createInitialState());
    
  const tools: Tool[] = [
    { id: "select", label: "select", icon: <MousePointer /> },
    { id: "rectangle", label: "rectangle", icon: <Square /> },
    { id: "ellipse", label: "ellipse", icon: <Circle /> },
    { id: "diamond-box", label: "diamond-box", icon: <Diamond /> },
    { id: "line", label: "line", icon: <Minus /> },
  ];

  useEffect(() => {
      activeToolRef.current = active;
    }, [active]);

    useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");

    const savedScene = loadSceneFromLocalStorage();
    sceneRef.current = savedScene;
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

    function hitResizeBox(
      x: number,
      y: number,
      rect: BoxLike,
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
    //      function getSelectionRect(el: Element): BoxLike {
    //   if (el.type !== "line") return el

    //   const x1 = el.x
    //   const y1 = el.y
    //   const x2 = el.x + el.width
    //   const y2 = el.y + el.height

    //   return {
    //     x: Math.min(x1, x2),
    //     y: Math.min(y1, y2),
    //     width: Math.abs(x2 - x1),
    //     height: Math.abs(y2 - y1),
    //   }
    // }

    function onMouseDown(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const { x, y } = getWorldCoordinates(e.clientX, e.clientY, rect, sceneRef.current.viewport);
      const activeTool = activeToolRef.current;
      const elements = sceneRef.current.elements;
      if (sceneRef.current.selectedElementId) {
        const selectedElement = elements.find(
          (el) => el.id === sceneRef.current.selectedElementId,
        );
        if (selectedElement && activeToolRef.current === "select") {
          const boundingBox = getElementBoundingBox(selectedElement);
          const handle = hitResizeBox(x, y, boundingBox);
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
        if (hitTest(x, y, el!, sceneRef.current.viewport.zoom)) {
          hit = el;
          break;
        }
      }
      if (!hit && activeToolRef.current === "select")
        sceneRef.current.selectedElementId = null;

      if (hit && activeToolRef.current === "select") {
        sceneRef.current.selectedElementId = hit.id;
        toolRef.current = {
          type: "moving-element",
          lastX: x,
          lastY: y,
        };
        sceneRef.current.isEditing = true;
        return;
      }
      if (activeToolRef.current === "rectangle") {
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
          type: "drawing",
          startX: x,
          startY: y,
          elementId: id,
        };
        sceneRef.current.isEditing = true;
        return;
      }
      if (activeToolRef.current === "ellipse") {
        sceneRef.current.selectedElementId = null;
        const id = crypto.randomUUID();
        sceneRef.current.elements.push({
          id,
          type: "ellipse",
          x,
          y,
          width: 0,
          height: 0,
          fillColor: "red",
          strokeColor: "blue",
        });
        sceneRef.current.selectedElementId = id;
        toolRef.current = {
          type: "drawing",
          startX: x,
          startY: y,
          elementId: id,
        };
        sceneRef.current.isEditing = true;
        return;
      }
      if (activeToolRef.current === "diamond-box") {
        sceneRef.current.selectedElementId = null;
        const id = crypto.randomUUID();
        sceneRef.current.elements.push({
          id,
          type: "diamond-box",
          x,
          y,
          width: 0,
          height: 0,
          fillColor: "red",
          strokeColor: "blue",
        });
        sceneRef.current.selectedElementId = id;
        toolRef.current = {
          type: "drawing",
          startX: x,
          startY: y,
          elementId: id,
        };
        sceneRef.current.isEditing = true;
        return;
      }
      if (activeToolRef.current === "line") {
        sceneRef.current.selectedElementId = null;
        const id = crypto.randomUUID();
        sceneRef.current.elements.push({
          id,
          type: "line",
          x,
          y,
          width: 0,
          height: 0,
          strokeColor: "red",
          strokeWidth: 8,
        });
        sceneRef.current.selectedElementId = id;
        toolRef.current = {
          type: "drawing",
          startX: x,
          startY: y,
          elementId: id,
        };
        sceneRef.current.isEditing = true;
        return;
      }
    }
    

    // these comments are for my understanding
    // i am using this function so that if width or height becomes negative then
    // i can make it postive but only doing this does not solves the entire problem
    // because if one edges passes the opposite eges then it should also changes the flip
    // direction means if we continue to move the left edge toward the right edge then width
    // decreases but if left edges crosses the right edge then width should be positive
    // and also we are changing the direction of the handle basically changes the handle which you are moving
    //for ex when left edge cross the right edge then we have to change the handle from left to right beacuse we are
    //doing the changes through the right edge
    function normalizeRectAfterResize(
      rect: BoxLike,
      handle: ResizeHandle,
    ): { rect: BoxLike; handle: ResizeHandle; flipped: boolean } {
      let newHandle = handle;
      let flipped = false;
      const next = { ...rect };

      if (next.width < 0) {
        next.x += next.width;
        next.width = Math.abs(next.width);
        flipped = true;

        if (handle.includes("left"))
          newHandle = handle.replace("left", "right") as ResizeHandle;
        else if (handle.includes("right"))
          newHandle = handle.replace("right", "left") as ResizeHandle;
      }

      if (next.height < 0) {
        next.y += next.height;
        next.height = Math.abs(next.height);
        flipped = true;

        if (handle.includes("top"))
          newHandle = handle.replace("top", "bottom") as ResizeHandle;
        else if (handle.includes("bottom"))
          newHandle = handle.replace("bottom", "top") as ResizeHandle;
      }

      return { rect: next, handle: newHandle, flipped };
    }
    function resizeLine(
      el: any,
      start: BoxLike,
      handle: ResizeHandle,
      dx: number,
      dy: number,
    ) {
      let x1 = start.x;
      let y1 = start.y;
      let x2 = start.x + start.width;
      let y2 = start.y + start.height;

      switch (handle) {
        case "resize-top-left-edges":
          x1 += dx;
          y1 += dy;
          break;
        case "resize-top-right-edges":
          x2 += dx;
          y1 += dy;
          break;
        case "resize-bottom-left-edges":
          x1 += dx;
          y2 += dy;
          break;
        case "resize-bottom-right-edges":
          x2 += dx;
          y2 += dy;
          break;
        case "resize-left-edge":
          x1 += dx;
          break;
        case "resize-right-edge":
          x2 += dx;
          break;
        case "resize-top-edge":
          y1 += dy;
          break;
        case "resize-bottom-edge":
          y2 += dy;
          break;
      }
      el.x = x1;
      el.y = y1;
      el.width = x2 - x1;
      el.height = y2 - y1;
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const { x, y } = getWorldCoordinates(e.clientX, e.clientY, rect, sceneRef.current.viewport);

      if (toolRef.current.type === "resizing-element") {
        const { elementId, handle, startRect, startX, startY } =
          toolRef.current;

        const el = sceneRef.current.elements.find((el) => el.id === elementId);
        if (!el) return;

        const dx = x - startX;
        const dy = y - startY;
        if (el.type === "line") {
          resizeLine(el, startRect, handle, dx, dy);
          return;
        }
        const resized = applyResize(startRect, handle, dx, dy);
        const {
          rect,
          handle: newHandle,
          flipped,
        } = normalizeRectAfterResize(resized, handle);

        Object.assign(el, rect);

        if (flipped) {
          toolRef.current = {
            type: "resizing-element",
            elementId,
            handle: newHandle,
            startX: x,
            startY: y,
            startRect: { ...el },
          };
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
      if (toolRef.current.type == "drawing") {
        const { startX, startY, elementId } = toolRef.current;
        const element = sceneRef.current.elements.find(
          (e) => e.id === elementId,
        );
        if (!element) return;
        if (element.type === "line") {
          element.x = startX;
          element.y = startY;
          element.width = x - startX;
          element.height = y - startY;
          return;
        }
        element.x = Math.min(startX, x);
        element.y = Math.min(startY, y);
        element.width = Math.abs(x - startX);
        element.height = Math.abs(y - startY);
      }
    }

    function onMouseUp(e: MouseEvent) {
      toolRef.current = { type: "idle" };
      sceneRef.current.isEditing = false;
      if (activeToolRef.current !== "select") {
        setActive("select"); 
    }
      saveSceneToLocalStorage(sceneRef.current);
    }
    function DebounceWheelSave() {
      if (wheelSaveTimeout !== null) {
        clearTimeout(wheelSaveTimeout);
      }

      wheelSaveTimeout = window.setTimeout(() => {
        saveSceneToLocalStorage(sceneRef.current);
        wheelSaveTimeout = null;
      }, WHEEL_SAVE_DELAY);
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
        DebounceWheelSave();
        return;
      }

      const viewport = sceneRef.current.viewport;
      // i am updating the offsetX and offsetY directly and the renderScene function
      // draws different part of the world
      viewport.offsetX += e.deltaX / viewport.zoom;
      viewport.offsetY += e.deltaY / viewport.zoom;
      DebounceWheelSave();
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
    return {
  canvasRef,
  tools,
  active,
  setActive,
}
}