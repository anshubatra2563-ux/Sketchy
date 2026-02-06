"use client"

import { ReactNode } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface DialogProps {
    open: boolean
    onClose: () => void
    children: ReactNode
    className?: string
}

export function Dialog({ open, onClose, children, className }: DialogProps) {
    if (!open) return null;

    return createPortal(<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/14 bg-opacity-50" onClick={onClose}>
        <div className={cn(
            "bg-white rounded-xl shadow-xl w-[520px] max-w-[95vw] p-6",
            className
        )}
            onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    </div>, document.body);


}