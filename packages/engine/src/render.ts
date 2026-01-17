import { SceneState,Element } from "./types";

export function renderScene(
    ctx :  CanvasRenderingContext2D,
    canvas : HTMLCanvasElement,
    state : SceneState
){
    const { offsetX,offsetY ,zoom} = state.viewport
    ctx.setTransform(1,0,0,1,0,0)
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.setTransform(zoom,0,0,zoom,-offsetX*zoom,-offsetY*zoom)

    state.elements.forEach((element) => {
        drawElement(ctx,element)
    });
    if(state.selectedElementId) {
        const selectedElement = state.elements.find((el) => el.id === state.selectedElementId);
        if(selectedElement){
           drawSelectionElementOutline(ctx,selectedElement,zoom)
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


function drawSelectionElementOutline(ctx:CanvasRenderingContext2D,element:{ x: number; y: number; width: number; height: number },zoom:number) {
    ctx.save()
    ctx.strokeStyle = "#4c9ffe"
    ctx.lineWidth   = 1/zoom
    ctx.setLineDash([6/zoom,4/zoom])
    ctx.strokeRect(element.x,element.y,element.width,element.height);
    ctx.restore()
}