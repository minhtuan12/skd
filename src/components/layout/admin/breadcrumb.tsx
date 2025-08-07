'use client'

import {
    Breadcrumb as ShadBreadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {IBreadCrumb} from "@/redux/slices/admin";

export function Breadcrumb() {
    const breadcrumb = useSelector((state: RootState) => state.admin.breadcrumb);

    return <ShadBreadcrumb>
        <BreadcrumbList>
            {breadcrumb.map((item: IBreadCrumb, index) => (
                <div key={index} className={'flex items-center gap-3'}>
                    <BreadcrumbItem className="hidden md:block">
                        {item?.href ? <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                            : <BreadcrumbPage>{item.title}</BreadcrumbPage>
                        }
                    </BreadcrumbItem>
                    {index !== breadcrumb.length - 1 ?
                        <BreadcrumbSeparator className="hidden md:block"/> : ''}
                </div>
            ))}
        </BreadcrumbList>
    </ShadBreadcrumb>
}
