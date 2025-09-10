"use client"

import * as React from "react"
import {ChevronDownIcon} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {dateOptions} from "@/constants/common";

interface IProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    disabled?: boolean
}

export function DatePicker({date, setDate, disabled = false}: IProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date"
                    className="w-full justify-between font-normal"
                    disabled={disabled}
                >
                    {date ? date.toLocaleDateString('vi-VN', dateOptions as any) : "Chọn ngày"}
                    <ChevronDownIcon/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                    // disabled={disabled}
                    startMonth={new Date(1990, 0)}
                    endMonth={new Date(2050, 11)}
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(newDate) => {
                        setDate(newDate)
                        setOpen(false)
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
