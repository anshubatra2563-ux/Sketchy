"use client"
import { useState } from "react"
import { ToolType , Tool, ToolBar, ToolButton} from "@/components/Toolbar"
import { MousePointer, Square, Circle, Diamond, Minus } from "lucide-react"
export function Canvas() {
    const [active ,setActive] = useState<ToolType>("select")
    const tools: Tool[] = [
        {id : "select" , label : "select" , icon:<MousePointer/>},
        {id : "rectangle" , label : "rectangle" , icon:<Square/>},
        {id : "ellipse" , label : "ellipse" , icon:<Circle/>},
        {id : "diamond-box" , label : "diamond-box" , icon:<Diamond/>},
        {id : "line" , label : "line" , icon:<Minus/>}
    ]
    return <div>
        <ToolBar>
           {tools.map((tool) => <ToolButton key={tool.id} tool={tool} onClick={setActive} isActive={active === tool.id}/>) }
        </ToolBar>
    </div>
}