// src/components/blog/TiptapEditor.tsx
'use client'

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Placeholder from '@tiptap/extension-placeholder'
import ImageUpload from './ImageUpload'
import ArticleContent from './ArticleContent'
import { storageService, ImageUploadResult } from '@/lib/firebase/storage'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link2, 
  Image as ImageIcon,
  Table as TableIcon,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Type,
  Upload,
  X
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  preview?: boolean
  uploaderId?: string
}

interface MenuButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  title?: string
}

const MenuButton = ({ onClick, isActive = false, disabled = false, children, title }: MenuButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-100 text-blue-700 border border-blue-200'
        : disabled
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {children}
  </button>
)

export default function TiptapEditor({ 
  content, 
  onChange, 
  placeholder = '記事の内容を入力してください...\n\n読者にとって価値のある、実践的な内容を心がけましょう。', 
  preview = false, 
  uploaderId 
}: TiptapEditorProps) {
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<ImageUploadResult[]>([])

  const handleImageUpload = (images: ImageUploadResult[]) => {
    setUploadedImages(prev => [...prev, ...images])
    
    // Insert images into editor
    images.forEach(image => {
      editor?.chain().focus().setImage({
        src: image.url, 
        alt: image.originalName,
        title: image.originalName
      }).run()
    })
    
    setShowImageUpload(false)
  }

  const handleImageRemove = async (imageId: string) => {
    if (!uploaderId) return
    
    try {
      await storageService.deleteImage(imageId, uploaderId)
      setUploadedImages(prev => prev.filter(img => img.id !== imageId))
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: placeholder,
      }),

    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'article-content focus:outline-none p-6 min-h-[400px] bg-white',
      },
    },
  })

  const addImage = () => {
    if (uploaderId) {
      setShowImageUpload(true)
    } else {
      const url = window.prompt('画像のURLを入力してください:')
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    }
  }

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('リンクのURLを入力してください:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">エディターを読み込み中...</div>
      </div>
    )
  }

  if (preview) {
    return (
      <div className="border-t border-gray-200">
        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 flex items-center">
          <span className="mr-2">👁️</span>
          プレビューモード
        </div>
        <div className="p-6 min-h-[400px] bg-white">
          <ArticleContent content={content} />
        </div>
      </div>
    )
  }

  return (
    <div className="relative">

      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 flex flex-wrap gap-1 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 sticky top-0 z-30">
        {/* Text Formatting */}
        <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="太字"
          >
            <Bold className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="斜体"
          >
            <Italic className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="インラインコード"
          >
            <Code className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Headings */}
        <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
          <MenuButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive('paragraph')}
            title="本文"
          >
            <Type className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="見出し1"
          >
            <Heading1 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="見出し2"
          >
            <Heading2 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="見出し3"
          >
            <Heading3 className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Lists and Quote */}
        <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="箇条書き"
          >
            <List className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="番号付きリスト"
          >
            <ListOrdered className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="引用"
          >
            <Quote className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Media and Links */}
        <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
          <MenuButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            title="リンク"
          >
            <Link2 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={addImage}
            title={uploaderId ? "画像をアップロード" : "画像URL"}
          >
            {uploaderId ? <Upload className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
          </MenuButton>
          <MenuButton
            onClick={insertTable}
            title="表"
          >
            <TableIcon className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center space-x-1">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            title="元に戻す"
          >
            <Undo className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            title="やり直し"
          >
            <Redo className="w-4 h-4" />
          </MenuButton>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Helper Text */}
      <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500 bg-gray-50">
        ヒント: 見出しや箇条書きを使って読みやすい構成を心がけましょう。
        画像は適切なキャプションを添え、外部リンクには正確なURLを設定してください。
      </div>

      {/* Image Upload Modal */}
      <AnimatePresence>
        {showImageUpload && uploaderId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowImageUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">画像をアップロード</h3>
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Component */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <ImageUpload
                  onUpload={handleImageUpload}
                  onRemove={handleImageRemove}
                  maxFiles={10}
                  existingImages={uploadedImages}
                  uploaderId={uploaderId}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
