import { Element } from "@repo/engine";
export function createElement(type: Element["type"], x: number, y: number):Element {
  const id = crypto.randomUUID();

  switch (type) {
    case "rectangle":
      return {
        id,
        type,
        x,
        y,
        width: 0,
        height: 0,
        fillColor: "red",
        strokeColor: "blue",
      };
    case "diamond-box":
      return {
        id,
        type,
        x,
        y,
        width: 0,
        height: 0,
        fillColor: "red",
        strokeColor: "blue",
      };
    case "ellipse":
      return {
        id,
        type,
        x,
        y,
        width: 0,
        height: 0,
        fillColor: "red",
        strokeColor: "blue",
      };
    case "line":
      return {
        id,
        type,
        x,
        y,
        width: 0,
        height: 0,
        strokeColor: "red",
        strokeWidth: 2,
      };
  }
}
