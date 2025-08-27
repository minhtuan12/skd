"use client"

import {EditorContent, useEditor} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import {Table} from "@tiptap/extension-table"
import {TableRow} from "@tiptap/extension-table-row"
import {TableCell} from "@tiptap/extension-table-cell"
import {TableHeader} from "@tiptap/extension-table-header"
import React from "react"

export default function CustomEditor() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Image,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: "<p>Soạn thảo văn bản như Word ✍️</p>",
        immediatelyRender: false
    })

    if (!editor) return null

    return (
        <div className="border rounded-lg p-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 border-b pb-2 mb-2">
                <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">
                    B
                </button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()}
                        className="px-2 py-1 border rounded italic">
                    I
                </button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className="px-2 py-1 border rounded underline">
                    U
                </button>
                <button onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                        className="px-2 py-1 border rounded">
                    H1
                </button>
                <button onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                        className="px-2 py-1 border rounded">
                    H2
                </button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className="px-2 py-1 border rounded">
                    • List
                </button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className="px-2 py-1 border rounded">
                    1. List
                </button>
                <button onClick={() => {
                    const url = prompt("Nhập link:")
                    if (url) editor.chain().focus().setLink({href: url}).run()
                }} className="px-2 py-1 border rounded">
                    🔗 Link
                </button>
                <button onClick={() => {
                    const url = prompt("Nhập URL ảnh:")
                    if (url) editor.chain().focus().setImage({src: url}).run()
                }} className="px-2 py-1 border rounded">
                    🖼️ Ảnh
                </button>
                <button
                    onClick={() => editor.chain().focus().insertTable({rows: 3, cols: 3, withHeaderRow: true}).run()}
                    className="px-2 py-1 border rounded">
                    ⬜ Table
                </button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} className="prose max-w-none min-h-[200px] h-full"/>
        </div>
    )
}
