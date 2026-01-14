export type Viewport = {
    offsetX : number,
    offsetY : number,
    zoom : number
}

export type RectangleElement = {
    id : string,
    x : number,
    y : number,
    width : number,
    height : number
} 

export type Element = RectangleElement

export type SceneState = {
    elements : Element[],
    viewport : Viewport
}