"use client"

import { ToolBar, ToolButton } from "@/components/Toolbar"
import { Button } from "@/components/ui/Button"
import { useCanvasEngine } from "./useCanvasEngine"
export function Canvas({ roomId }: { roomId?: string }) {
  
  const { canvasRef , tools , active , setActive } = useCanvasEngine(roomId);
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
