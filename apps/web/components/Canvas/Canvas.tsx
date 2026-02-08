"use client"
import { useState, useEffect } from "react"
import { ToolBar, ToolButton } from "@/components/Toolbar"
import { Button } from "@/components/ui/Button"
import { useCanvasEngine } from "./useCanvasEngine"
import { useShareFlow } from "@/components/share/useShareFlow"
import { ShareEntryDialog } from "@/components/share/ShareEntryDialog"
import { ShareLinkDialog } from "@/components/share/ShareLinkDialog"
import { Sidebar } from "./Sidebar/Sidebar"
import { Element } from "@repo/engine"
export function Canvas({ roomId }: { roomId?: string }) {

  const { canvasRef, tools, active, setActive, sceneRef } = useCanvasEngine(roomId);
  const share = useShareFlow(roomId)
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      const selectedId = sceneRef.current?.selectedElementId;

      const el = selectedId
        ? sceneRef.current?.elements.find(e => e.id === selectedId) || null
        : null;

      setSelectedElement(prev => {
        if (prev?.id === el?.id) return prev;
        return el;
      });

    }, 200);

    return () => clearInterval(interval);
  }, []);

  function handleUpdateElement(updates: Partial<Element>) {
    if (!sceneRef.current?.selectedElementId) return;

    const el = sceneRef.current.elements.find(
      e => e.id === sceneRef.current!.selectedElementId
    );

    if (!el) return;

    Object.assign(el, updates);

    setSelectedElement({ ...el });
  }

  function handleCloseSidebar() {
    if (!sceneRef.current) return;

    sceneRef.current.selectedElementId = null;
    setSelectedElement(null);
  }


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
      <Button size="md" variant="primary" className="absolute top-4 right-4 z-20" onClick={share.handleShareClick}>
        Share
      </Button>
      <canvas ref={canvasRef} />
      
      {selectedElement && (
        <Sidebar
          selectedElement={selectedElement}
          onUpdateElement={handleUpdateElement}
          onClose={handleCloseSidebar}
        />
      )}
      <ShareEntryDialog
        open={share.introOpen}
        onClose={share.closeIntro}
        onStart={share.startSession}
      />
      <ShareLinkDialog
        open={share.linkOpen}
        onClose={share.closeLink}
        link={share.shareLink}
        onCopy={share.copyLink}
        onStop={share.stopSession}
      />
    </div>
  );
}
