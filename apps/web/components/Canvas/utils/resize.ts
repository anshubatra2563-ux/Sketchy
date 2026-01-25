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

export function normalizeRectAfterResize(
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

export function resizeLine(
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
