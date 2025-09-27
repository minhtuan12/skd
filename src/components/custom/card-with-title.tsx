'use client'

import React from "react";
import {cn} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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
    href?: string;
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
        href
    }: IProps) {
    return (
        <div
            onClick={onClick}
            className={cn(`rounded rounded-b-[5px] shadow-lg ${bgTitleColor} flex flex-col ${border ? 'border border-solid h-full' : ''}`, className)}>
            {
                !bgImageUrl ?
                    (
                        !href ?
                            <h3 className={cn('px-3 box-border text-center text-white text-lg w-full font-semibold h-14 flex items-center justify-center', titleHeight)}>
                                {title}
                            </h3> :
                            <Link
                                className={cn('px-3 box-border text-center text-white text-lg w-full font-semibold h-14 flex items-center justify-center', titleHeight)}
                                href={href}
                            >
                                {title}
                            </Link>
                    ) : <div className={'w-full h-48 relative'}><Image
                        src={bgImageUrl || '/logos/principles.png'}
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
