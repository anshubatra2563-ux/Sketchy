import { BoxLike, ResizeHandle } from "../types";

export function applyResize(
      rect: BoxLike,
      handle: ResizeHandle,
      dx: number,
      dy: number,
    ): BoxLike {
      const next = { ...rect };

      switch (handle) {
        case "resize-right-edge":
          next.width += dx;
          break;

        case "resize-left-edge":
          next.x += dx;
          next.width -= dx;
          break;

        case "resize-bottom-edge":
          next.height += dy;
          break;

        case "resize-top-edge":
          next.y += dy;
          next.height -= dy;
          break;

        case "resize-top-left-edges":
          next.x += dx;
          next.width -= dx;
          next.y += dy;
          next.height -= dy;
          break;

        case "resize-top-right-edges":
          next.width += dx;
          next.y += dy;
          next.height -= dy;
          break;

        case "resize-bottom-right-edges":
          next.width += dx;
          next.height += dy;
          break;

        case "resize-bottom-left-edges":
          next.x += dx;
          next.width -= dx;
          next.height += dy;
          break;
      }

      return next;
    }