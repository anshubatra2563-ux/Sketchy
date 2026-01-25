export type ResizeHandle =
  | "resize-top-edge"
  | "resize-right-edge"
  | "resize-bottom-edge"
  | "resize-left-edge"
  | "resize-top-left-edges"
  | "resize-top-right-edges"
  | "resize-bottom-right-edges"
  | "resize-bottom-left-edges";

export type ToolState =
  | { type: "idle" }
  | {
      type: "drawing";
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
      startRect: BoxLike;
    };

export type ActiveTool = "select" | "rectangle" | "ellipse" | "diamond-box" | "line";

export type BoxLike = {
  x: number;
  y: number;
  width: number;
  height: number;
};