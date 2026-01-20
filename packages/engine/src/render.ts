import { SceneState,Element } from "./types";

export const SELECTION_PADDING_PX = 8;
export const RESIZE_BOX_SIZE_PX = 8;
export function renderScene(
    ctx :  CanvasRenderingContext2D,
    canvas : HTMLCanvasElement,
    state : SceneState,
){
    const { offsetX,offsetY ,zoom} = state.viewport
    ctx.setTransform(1,0,0,1,0,0)
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.setTransform(zoom,0,0,zoom,-offsetX*zoom,-offsetY*zoom)

    state.elements.forEach((element) => {
        drawElement(ctx,element)
    });
    if(state.selectedElementId && !state.isEditing) {
        const selectedElement = state.elements.find((el) => el.id === state.selectedElementId);
        if(selectedElement){
            // this contains the coordinates of the selection box that will be used for drawign resize boxes
           const selectionBox = getSelectionBoxWithPadding(selectedElement,zoom)
           drawSelectionElementOutline(ctx,selectionBox,zoom)
           drawResizeBoxes(ctx,selectionBox,zoom)
        }
    }
} 


function drawElement(ctx : CanvasRenderingContext2D,element : Element){
   switch(element.type){
       case "rectangle":
        ctx.fillStyle = element.fillColor;
        ctx.fillRect(element.x, element.y, element.width, element.height);
        ctx.strokeStyle = element.strokeColor;
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        break;
   }
}


// this function will give coordinates of the selection box
function getSelectionBoxWithPadding(
    element : {x: number; y: number; width: number; height: number},
    zoom : number
) {
    const padding = SELECTION_PADDING_PX / zoom;
    return {
        x : element.x - padding,
        y : element.y - padding,
        width : element.width + padding * 2,
        height : element.height + padding * 2
    }
}

function drawSelectionElementOutline(ctx:CanvasRenderingContext2D,element:{ x: number; y: number; width: number; height: number },zoom:number) {
    ctx.save()
    ctx.strokeStyle = "#4c9ffe"
    ctx.lineWidth   = 1/zoom
    //ctx.setLineDash([6/zoom,4/zoom])
    ctx.strokeRect(element.x,element.y,element.width,element.height);
    ctx.restore()
}

function drawResizeBoxes(ctx:CanvasRenderingContext2D,element:{x : number; y: number; width: number; height: number},zoom:number) {
    const size = RESIZE_BOX_SIZE_PX / zoom;
    const radius = size*0.5
    const half = size / 2;
    const left = element.x
    const right = element.x + element.width
    const top  = element.y
    const bottom = element.y + element.height
    const centerX = element.x + element.width / 2
    const centerY = element.y + element.height / 2

    const resizeBoxPosition = [
        { x : left, y : top },
        { x : centerX, y : top },
        { x : right , y : top },
        { x : left , y : centerY },
        { x : right , y : centerY },
        { x : left , y : bottom },
        { x : centerX , y : bottom },
        { x : right , y : bottom },
    ]
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#4c9ffe";
    ctx.lineWidth = 1 / zoom;

    resizeBoxPosition.forEach((pos) => {
        ctx.beginPath();
        ctx.roundRect(pos.x - half,pos.y - half,size,size,radius);
        ctx.fill();
        ctx.stroke();
    })
    ctx.restore()
}