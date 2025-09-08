"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import {cn} from "@/lib/utils"

interface IProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
    required?: boolean
}

function Label(
    {
        className,
        required = false,
        ...props
    }: IProps) {
    return (
        <div className={`flex gap-0.5 ${required ? '-mb-1.5' : ''}`}>
            <LabelPrimitive.Root
                data-slot="label"
                className={cn(
                    "flex items-center gap-2 text-sm leading-none font-semibold select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                    className
                )}
                {...props}
            />
            {required ? <div className={'text-[red]'}>*</div> : ''}
        </div>
    )
}

export {Label}
