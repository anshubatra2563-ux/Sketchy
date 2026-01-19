export type Viewport = {
    offsetX : number,
    offsetY : number,
    zoom : number
}

export type RectangleElement = {
    id : string,
    type:"rectangle",
    x : number,
    y : number,
    width : number,
    height : number,
    fillColor: string;
    strokeColor: string;
} 

export type Element = RectangleElement 

export type SceneState = {
    elements : Element[],
    viewport : Viewport,
    selectedElementId: string | null;
    isEditing : boolean
}