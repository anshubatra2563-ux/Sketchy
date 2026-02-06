import { ReactNode } from "react";
import { cn } from "@/lib/utils"
interface DialogHeaderProps {
    children: ReactNode
    className?:string
}


export function DialogHeader({ children ,className } : DialogHeaderProps) {
    return (
        <h2 className={cn("text-lg font-semibold mb-3",className)}>
            {children}
        </h2>
    )
}