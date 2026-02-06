import { ReactNode } from "react";
import { cn } from "@/lib/utils";
interface DialogBodyProps {
    children:ReactNode
    className?:string
}

export function DialogBody({ children, className}: DialogBodyProps) {
    return <div className={cn("text-sm text-gray-600", className)}>
        {children}
    </div>
}