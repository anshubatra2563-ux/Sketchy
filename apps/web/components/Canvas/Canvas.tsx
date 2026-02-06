"use client"

import { ToolBar, ToolButton } from "@/components/Toolbar"
import { Button } from "@/components/ui/Button"
import { useCanvasEngine } from "./useCanvasEngine"
import { useShareFlow } from "@/components/share/useShareFlow"
import { ShareEntryDialog } from "@/components/share/ShareEntryDialog"
import { ShareLinkDialog } from "@/components/share/ShareLinkDialog"
export function Canvas({ roomId }: { roomId?: string }) {
  
  const { canvasRef , tools , active , setActive } = useCanvasEngine(roomId);
  const share = useShareFlow(roomId)
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
