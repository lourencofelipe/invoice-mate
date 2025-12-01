import * as React from "react"

import { cn } from "@/shared/utils/cn"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-[#DDDDDD] bg-white px-4 py-3 text-sm text-[#333333] placeholder:text-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#3366FF] focus:border-[#3366FF] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

