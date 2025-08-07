import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import {cn} from "@/lib/utils";

interface IProps {
    title: string | React.ReactNode;
    description?: string;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
    footer?: React.ReactNode;
    children: React.ReactNode;
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
        children
    }: IProps) {
    return <Card className={cn("pb-4 shadow-md", className)}>
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
