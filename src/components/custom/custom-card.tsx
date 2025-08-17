import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";

interface IProps {
    title: string | React.ReactNode;
    description?: string;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
    footer?: React.ReactNode;
    children: React.ReactNode;
    onClick?: () => void;
    badge?: string;
}

export default function CustomCard(
    {
        title,
        description = '',
        className = '',
        headerClassName = '',
        contentClassName = '',
        footerClassName = '',
        footer,
        children,
        onClick,
        badge
    }: IProps) {
    return <Card
        className={
            cn(
                `pb-4 ${badge ? 'relative' : ''} shadow-md ${onClick ? 'cursor-pointer' : ''}`,
                className,
                `${badge === 'Đã ẩn' ? 'bg-gray-100' : ''}`
            )
        }
        onClick={onClick}
    >
        {badge ? <Badge className={'absolute -top-2.5 right-2 bg-yellow-700'}>{badge}</Badge> : ''}
        <CardHeader className={headerClassName}>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className={contentClassName}>
            {children}
        </CardContent>
        {
            footer ? <CardFooter className={cn("border-t px-6 !pt-4 gap-4 justify-end", footerClassName)}>
                {footer}
            </CardFooter> : ''
        }
    </Card>
}
