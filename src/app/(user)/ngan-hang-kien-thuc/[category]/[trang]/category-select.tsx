'use client'

import {redirect} from "next/navigation";
import {buildDetailPath} from "@/lib/utils";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {IKnowledgeCategory} from "@/models/knowledge-category";
import React from "react";

export default function ({cat, value}: any) {
    return <Select value={value} onValueChange={value => {
        redirect(`/ngan-hang-kien-thuc/${buildDetailPath(cat.name, cat._id)}/1?sub=${value}`)
    }}>
        <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Chọn vấn đề"/>
        </SelectTrigger>
        <SelectContent>
            {cat.children.map((sub: IKnowledgeCategory) => (
                <SelectItem key={sub._id as string} value={sub._id as string}>
                    {sub.name}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
}
