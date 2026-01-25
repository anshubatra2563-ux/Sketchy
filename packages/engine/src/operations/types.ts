import { Element } from "../types";

export type BaseOperation = {
    opId : string,
    timestamp : number
}

export type CreateElementOp = BaseOperation & { 
    type : "create",
    element : Element
}

export type MoveElementOp = BaseOperation & {
    type : "move",
    elementId : string,
    dx : number,
    dy : number
}

export type Operation = CreateElementOp | MoveElementOp

