'use client'

import React from "react";
import {cn} from "@/lib/utils";
import Image from "next/image";

interface IProps {
    title: string;
    bgTitleColor: string;
    titleHeight?: string;
    children: React.ReactNode;
    className?: string;
    childrenBg?: string;
    border?: boolean;
    bgImageUrl?: string;
    onClick?: () => void;
}

export default function CardWithTitle(
    {
        title,
        bgTitleColor,
        titleHeight = '',
        children,
        className,
        childrenBg = '',
        border = false,
        bgImageUrl = '',
        onClick,
    }: IProps) {
    return (
        <div
            onClick={onClick}
            className={cn(`rounded rounded-b-[5px] shadow-lg ${bgTitleColor} flex flex-col ${border ? 'border border-solid h-full' : ''}`, className)}>
            {
                !bgImageUrl ?
                    <h3 className={cn('px-3 box-border text-center text-white text-lg w-full font-medium h-14 flex items-center justify-center', titleHeight)}>
                        {title}
                    </h3> : <div className={'w-full h-48 relative'}><Image
                        src={bgImageUrl}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                    /></div>
            }
            <div
                className={cn('box-border px-4 py-4 bg-white flex-1 flex flex-col h-auto md:h-[calc(100%-56px)] rounded-b', childrenBg)}
            >
                {children}
            </div>
        </div>
    );
}
