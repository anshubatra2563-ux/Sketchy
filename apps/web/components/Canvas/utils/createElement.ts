import { Element } from "@repo/engine";
export function createElement(type: Element["type"], x: number, y: number):Element {
  const baseElement = {
    id : crypto.randomUUID(),
    x,
    y,
    width:0,
    height:0,
    strokeColor:"#000000",
    strokeWidth : 2,
    strokeStyle : "solid" as const,
    opacity : 100
  }

  if(type === "line"){
    return {
      ...baseElement,
      type: "line",
    }
  }
// for other shapes, we can set default fillColor and roundness
  return {
    ...baseElement,
    type,
    fillColor : "transparent",
    roundness : "rounded" as const,
  }
}
