"use client"

import {useEffect, useState} from "react"
import {IMap} from "@/models/map"

export default function useMapPagination(maps: IMap[]) {
    const [itemsPerPage, setItemsPerPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth

            if (width < 768) {
                setItemsPerPage(1)
            } else if (width < 1280) {
                setItemsPerPage(3)
            } else {
                setItemsPerPage(5)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        setTotalPages(Math.ceil(maps.length / itemsPerPage))
    }, [maps.length, itemsPerPage])

    return {itemsPerPage, totalPages}
}
