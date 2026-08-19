'use client'

import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'

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
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),

  Underline,

  Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],

    content: value || '',

    editable: !disabled,

    editorProps: {
      attributes: {
        class:
  'min-h-[300px] px-4 py-4 outline-none prose prose-sm max-w-none prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6',
        'data-placeholder': placeholder,
      },
    },

    onUpdate: ({ editor }) => {
  const html = editor.getHTML()

  console.log('[RichTextEditor] HTML:', html)

  onChange(html)
},
  })

  /*
   * Sinkronisasi value dari parent ke editor.
   */
  useEffect(() => {
    if (!editor) return

    const currentHTML = editor.getHTML()
    const nextHTML = value || ''

    if (currentHTML !== nextHTML) {
      editor.commands.setContent(nextHTML, {
        emitUpdate: false,
      })
    }
  }, [editor, value])

  /*
   * Update status editable ketika disabled berubah.
   */
  useEffect(() => {
    if (!editor) return

    editor.setEditable(!disabled)
  }, [editor, disabled])

  if (!editor) {
    return (
      <div className="rounded-xl border border-[#F3DEC8] bg-white">
        <div className="h-[350px] animate-pulse bg-gray-50" />
      </div>
    )
  }

  /*
   * Helper agar klik toolbar tidak membuat
   * selection editor hilang.
   */
  const preventEditorBlur = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  /*
   * Link:
   * simpan selection sebelum window.prompt()
   * supaya selection tidak hilang.
   */
  const handleLink = () => {
    const { from, to } = editor.state.selection

    const previousUrl =
      editor.getAttributes('link').href || ''

    const url = window.prompt(
      'Masukkan URL:',
      previousUrl || 'https://'
    )

    if (url === null) {
      return
    }

    editor
      .chain()
      .focus()
      .setTextSelection({ from, to })
      .run()

    if (url.trim() === '') {
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
        href: url.trim(),
      })
      .run()
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

        {/* ========================================================
            BOLD
        ======================================================== */}

        <button
          type="button"
          title="Bold"
          disabled={
            disabled ||
            !editor
              .can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          onMouseDown={preventEditorBlur}
          onClick={() => {
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }}
          className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
            editor.isActive('bold')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          } disabled:cursor-not-allowed disabled:opacity-30`}
        >
          B
        </button>

        {/* ========================================================
            ITALIC
        ======================================================== */}

        <button
          type="button"
          title="Italic"
          disabled={
            disabled ||
            !editor
              .can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          onMouseDown={preventEditorBlur}
          onClick={() => {
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }}
          className={`rounded-lg px-3 py-2 text-sm italic transition ${
            editor.isActive('italic')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          } disabled:cursor-not-allowed disabled:opacity-30`}
        >
          I
        </button>

        {/* ========================================================
            UNDERLINE
        ======================================================== */}

        <button
          type="button"
          title="Underline"
          disabled={
            disabled ||
            !editor
              .can()
              .chain()
              .focus()
              .toggleUnderline()
              .run()
          }
          onMouseDown={preventEditorBlur}
          onClick={() => {
            editor
              .chain()
              .focus()
              .toggleUnderline()
              .run()
          }}
          className={`rounded-lg px-3 py-2 text-sm underline transition ${
            editor.isActive('underline')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          } disabled:cursor-not-allowed disabled:opacity-30`}
        >
          U
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* ========================================================
            HEADING
        ======================================================== */}

        <button
          type="button"
          title="Heading 2"
          disabled={
            disabled ||
            !editor
              .can()
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
          onMouseDown={preventEditorBlur}
          onClick={() => {
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }}
          className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
            editor.isActive('heading', {
              level: 2,
            })
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          } disabled:cursor-not-allowed disabled:opacity-30`}
        >
          H
        </button>

        {/* ========================================================
            BULLET LIST
        ======================================================== */}

        <button
          type="button"
          title="Bullet List"
          disabled={
            disabled ||
            !editor
              .can()
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          onMouseDown={preventEditorBlur}
          onClick={() => {
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }}
          className={`rounded-lg px-3 py-2 text-sm transition ${
            editor.isActive('bulletList')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          } disabled:cursor-not-allowed disabled:opacity-30`}
        >
          • List
        </button>

        {/* ========================================================
            NUMBERED LIST
        ======================================================== */}

        <button
          type="button"
          title="Numbered List"
          disabled={
            disabled ||
            !editor
              .can()
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          onMouseDown={preventEditorBlur}
          onClick={() => {
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }}
          className={`rounded-lg px-3 py-2 text-sm transition ${
            editor.isActive('orderedList')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          } disabled:cursor-not-allowed disabled:opacity-30`}
        >
          1. List
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* ========================================================
            BLOCKQUOTE
        ======================================================== */}

        <button
          type="button"
          title="Quote"
          disabled={
            disabled ||
            !editor
              .can()
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
          onMouseDown={preventEditorBlur}
          onClick={() => {
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }}
          className={`rounded-lg px-3 py-2 text-sm transition ${
            editor.isActive('blockquote')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          } disabled:cursor-not-allowed disabled:opacity-30`}
        >
          “
        </button>

        {/* ========================================================
            LINK
        ======================================================== */}

        <button
          type="button"
          title="Link"
          disabled={disabled}
          onMouseDown={preventEditorBlur}
          onClick={handleLink}
          className={`rounded-lg px-3 py-2 text-sm transition ${
            editor.isActive('link')
              ? 'bg-[#F58220] text-white'
              : 'text-gray-600 hover:bg-orange-100'
          } disabled:cursor-not-allowed disabled:opacity-30`}
        >
          🔗
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* ========================================================
            UNDO
        ======================================================== */}

        <button
          type="button"
          title="Undo"
          disabled={
            disabled ||
            !editor
              .can()
              .chain()
              .focus()
              .undo()
              .run()
          }
          onMouseDown={preventEditorBlur}
          onClick={() => {
            editor
              .chain()
              .focus()
              .undo()
              .run()
          }}
          className="rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ↶
        </button>

        {/* ========================================================
            REDO
        ======================================================== */}

        <button
          type="button"
          title="Redo"
          disabled={
            disabled ||
            !editor
              .can()
              .chain()
              .focus()
              .redo()
              .run()
          }
          onMouseDown={preventEditorBlur}
          onClick={() => {
            editor
              .chain()
              .focus()
              .redo()
              .run()
          }}
          className="rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-30"
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