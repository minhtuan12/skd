'use client'

import {motion, type MotionProps} from "framer-motion";
import React from "react";

type MotionTags = 'div' | 'section' | 'article' | 'main' | 'header' | 'footer' | 'aside' | 'span' | 'nav';

interface AnimatedSectionProps extends MotionProps {
    asTag?: MotionTags;
    className?: string;
    children: React.ReactNode;
    useMotion?: boolean;
}

export default function AnimatedSection(
    {
        asTag = "section",
        className,
        children,
        useMotion = true,
        ...motionProps
    }: AnimatedSectionProps) {
    const Element: any = useMotion ? motion[asTag] ?? motion.section : asTag;

    return (
        <Element className={className} {...motionProps}>
            {children}
        </Element>
    );
}
