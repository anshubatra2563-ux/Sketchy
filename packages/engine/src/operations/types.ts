import { Element } from "../types";

export type BaseOperation = {
    opId : string,
    timestamp : number,
    elementId : string
}

export type CreateElementOp = BaseOperation & { 
    type : "create",
    element : Element
}

export type MoveElementOp = BaseOperation & {
    type : "move",
    dx : number,
    dy : number
}

export type ResizeElementOp = BaseOperation & {
    type : "resize",
    rect : {
        x : number,
        y : number,
        width : number,
        height : number
    }
}

export type Operation = CreateElementOp | MoveElementOp | ResizeElementOp

