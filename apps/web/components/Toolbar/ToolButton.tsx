import { cn } from "@/lib/utils";
import { ToolButtonProps } from "./types";

export function ToolButton({ tool , onClick, isActive } : ToolButtonProps) {
    return (
        <button onClick={() => onClick(tool.id)} className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
            isActive ? "bg-blue-500 text-white" : "bg-white text-gray-700 border border-gray-200" 
        )}>
            {tool.icon}
        </button>
    )
}