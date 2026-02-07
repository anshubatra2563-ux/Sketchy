export type Viewport = {
  offsetX: number;
  offsetY: number;
  zoom: number;
};

export type BaseElement = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  strokeStyle: "solid" | "dashed" | "dotted";
  opacity: number;
  roundness: "sharp" | "rounded";
}

export type RectangleElement = BaseElement & {
  type: "rectangle";
};

export type EllipseElement = BaseElement & {
  type: "ellipse";
};

export type DiamondElement = BaseElement & {
  type: "diamond-box";
};

export type LineElement = Omit<BaseElement, "fillColor" | "roundness"> & {
  type: "line";
};

export type Element =
  | RectangleElement
  | EllipseElement
  | DiamondElement
  | LineElement;

export type SceneState = {
  elements: Element[];
  viewport: Viewport;
  selectedElementId: string | null;
  isEditing: boolean;
};
