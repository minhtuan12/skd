"use client"

import {useSortable,} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {TableCell, TableRow} from "@/components/ui/table";
import React, {PropsWithChildren} from "react";
import {GripVertical} from "lucide-react";

function SortableRow({id, children}: PropsWithChildren<{ id: string }>) {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
        useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : "auto",
        background: "white",
        boxShadow: isDragging ? "0 4px 8px rgba(0,0,0,0.15)" : "none",
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell {...attributes} {...listeners} className="text-center w-10 cursor-grab">
                <GripVertical className={'text-gray-400'}/>
            </TableCell>
            {children}
        </TableRow>
    );
}

export default SortableRow;
