export type Viewport = {
  offsetX: number;
  offsetY: number;
  zoom: number;
};

export type RectangleElement = {
  id: string;
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
};

export type EllipseElement = {
  id: string;
  type: "ellipse";
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
};

export type DiamondElement = {
  id: string;
  type: "diamond-box";
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
};
export type LineElement = {
  id: string;
  type: "line";
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  strokeWidth: number;
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
