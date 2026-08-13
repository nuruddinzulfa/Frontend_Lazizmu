'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Tulis isi konten...',
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],

    content: value,

    editable: !disabled,

    editorProps: {
      attributes: {
        class:
          'min-h-[300px] px-4 py-4 outline-none prose prose-sm max-w-none',
      },

      handleDOMEvents: {
        keydown: (_, event) => {
          if (
            (event.ctrlKey || event.metaKey) &&
            event.key === 'b'
          ) {
            return false
          }

          return false
        },
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  /*
  |--------------------------------------------------------------------------
  | Sinkronisasi value dari parent
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!editor) return

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '', {
        emitUpdate: false,
      })
    }
  }, [value, editor])

  if (!editor) {
    return (
      <div className="rounded-xl border border-[#F3DEC8] bg-white">
        <div className="h-[350px] animate-pulse bg-gray-50" />
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[#F3DEC8] bg-white ${
        disabled ? 'opacity-60' : ''
      }`}
    >
      {/* ============================================================
          TOOLBAR
      ============================================================ */}

      <div className="flex flex-wrap items-center gap-1 border-b border-[#F3DEC8] bg-[#FFF8F2] p-2">

        {/* Bold */}

        <button
          type="button"
          title="Bold"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          disabled={
            !editor.can().chain().focus().toggleBold().run()
          }
          className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
            editor.isActive('bold')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          }`}
        >
          B
        </button>

        {/* Italic */}

        <button
          type="button"
          title="Italic"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className={`rounded-lg px-3 py-2 text-sm italic transition ${
            editor.isActive('italic')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          }`}
        >
          I
        </button>

        {/* Underline */}

        <button
          type="button"
          title="Underline"
          onClick={() =>
            editor.chain().focus().toggleUnderline().run()
          }
          className={`rounded-lg px-3 py-2 text-sm underline transition ${
            editor.isActive('underline')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          }`}
        >
          U
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* Heading 1 */}

        <button
          type="button"
          title="Heading 1"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          }
          className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
            editor.isActive('heading', {
              level: 2,
            })
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          }`}
        >
          H
        </button>

        {/* Bullet List */}

        <button
          type="button"
          title="Bullet List"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className={`rounded-lg px-3 py-2 text-sm transition ${
            editor.isActive('bulletList')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          }`}
        >
          • List
        </button>

        {/* Numbered List */}

        <button
          type="button"
          title="Numbered List"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className={`rounded-lg px-3 py-2 text-sm transition ${
            editor.isActive('orderedList')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          }`}
        >
          1. List
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* Blockquote */}

        <button
          type="button"
          title="Quote"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
          className={`rounded-lg px-3 py-2 text-sm transition ${
            editor.isActive('blockquote')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          }`}
        >
          “
        </button>

        {/* Link */}

        <button
          type="button"
          title="Link"
          onClick={() => {
            const previousUrl =
              editor.getAttributes('link').href

            const url = window.prompt(
              'Masukkan URL:',
              previousUrl || 'https://'
            )

            if (url === null) return

            if (url === '') {
              editor
                .chain()
                .focus()
                .unsetLink()
                .run()

              return
            }

            editor
              .chain()
              .focus()
              .setLink({
                href: url,
              })
              .run()
          }}
          className={`rounded-lg px-3 py-2 text-sm transition ${
            editor.isActive('link')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          }`}
        >
          🔗
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* Undo */}

        <button
          type="button"
          title="Undo"
          onClick={() =>
            editor.chain().focus().undo().run()
          }
          disabled={
            !editor.can().chain().focus().undo().run()
          }
          className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-orange-100 disabled:opacity-30"
        >
          ↶
        </button>

        {/* Redo */}

        <button
          type="button"
          title="Redo"
          onClick={() =>
            editor.chain().focus().redo().run()
          }
          disabled={
            !editor.can().chain().focus().redo().run()
          }
          className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-orange-100 disabled:opacity-30"
        >
          ↷
        </button>
      </div>

      {/* ============================================================
          EDITOR
      ============================================================ */}

      <EditorContent editor={editor} />

      {/* ============================================================
          FOOTER
      ============================================================ */}

      <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-400">
        Gunakan toolbar untuk memformat tulisan.
      </div>
    </div>
  )
}