export type ToolType = "select" | "rectangle" | "ellipse" | "line" | "diamond-box";

export type Tool = {
    id : ToolType,
    label : string,
    icon : React.ReactNode
}

export type ToolButtonProps = {
    tool : Tool,
    onClick : (tool : ToolType) => void,
    isActive : boolean
}