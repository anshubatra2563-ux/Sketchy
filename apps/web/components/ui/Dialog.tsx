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

    return createPortal(<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/8" onClick={onClose}>
        <div className={cn(
                "bg-white rounded-2xl shadow-2xl w-[640px] max-w-[95vw] p-8",
            className
        )}
            onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    </div>, document.body);


}