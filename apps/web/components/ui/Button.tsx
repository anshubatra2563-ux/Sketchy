"use client"

import { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode
    variant?: "primary" | "secondary" | "outline"
    size?: "sm" | "md" | "lg"
    icon?: ReactNode
    loading?: boolean
}

export function Button({
    children,
    variant = "primary",
    size = "md",
    icon,
    loading = false,
    className,
    disabled,
    type,
    ...props }
    : ButtonProps) {

    const base =
        "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 " +
        "disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[#6965db] text-white hover:bg-[#5850c9] active:bg-[#4a44b0]",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        outline: "border-2 border-[#6965db] text-[#6965db] hover:bg-[#6965db]/10",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    const iconOnly = !children && icon;

    return (
        <button type={type ?? "button"} disabled={disabled || loading} className={cn(
            base,
            variants[variant],
            iconOnly ? "p-2" : sizes[size],
            className
        )}
            {...props}>
            {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {!loading && icon && <span className="shrink-0">{icon}</span>}

            {children}
        </button>
    )
} 