import React from "react"
import { cn } from "@/lib/utils"
type ToolBarProps = {
    children : React.ReactNode,
    className?: string
}
export function ToolBar( { children,className}: ToolBarProps) {
  return (
    <div className={cn("flex items-center gap-2 py-2 bg-white border-b border-gray-200",className)}>
    {children}
    </div>
  )
}
