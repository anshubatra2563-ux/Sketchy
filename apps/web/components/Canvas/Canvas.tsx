"use client"

import { ToolBar, ToolButton } from "@/components/Toolbar"
import { useCanvasEngine } from "./useCanvasEngine"
export function Canvas() {
  
  const { canvasRef , tools , active , setActive } = useCanvasEngine();
  return (
    <div className="relative">
      <ToolBar className="absolute">
        {tools.map((tool) => (
          <ToolButton
            key={tool.id}
            tool={tool}
            onClick={setActive}
            isActive={active === tool.id}
          />
        ))}
      </ToolBar>
      <canvas ref={canvasRef} />
    </div>
  );
}
