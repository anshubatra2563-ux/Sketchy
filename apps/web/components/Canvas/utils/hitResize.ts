import { BoxLike,ResizeHandle } from "../types";
import { SELECTION_PADDING_PX, RESIZE_BOX_SIZE_PX } from "@repo/engine";    
export function hitResizeBox(
      x: number,
      y: number,
      rect: BoxLike,
      zoom : number
    ): ResizeHandle | null {
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