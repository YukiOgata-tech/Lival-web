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
import { LinkPreview, LinkPreviewAttributes } from './LinkPreviewNode'
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
  X,
  Maximize2
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  preview?: boolean
  uploaderId?: string
}

interface ImageSizeOption {
  label: string
  width: string
  description: string
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
  const [showImageSizeDialog, setShowImageSizeDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<ImageUploadResult[]>([])
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  const imageSizeOptions: ImageSizeOption[] = [
    { label: '小', width: '300px', description: '記事内の補足的な画像に最適' },
    { label: '中', width: '500px', description: 'バランスの取れたサイズ' },
    { label: '大', width: '700px', description: '重要な画像を目立たせる' },
    { label: 'フル幅', width: '100%', description: '記事幅いっぱいに表示' },
  ]

  const handleImageUpload = (images: ImageUploadResult[]) => {
    setUploadedImages(prev => [...prev, ...images])

    // Insert images into editor with default medium size
    images.forEach(image => {
      editor?.chain().focus().setImage({
        src: image.url,
        alt: image.originalName,
        title: image.originalName,
        style: 'width: 500px; max-width: 100%; height: auto; display: block; margin: 1rem auto;'
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
        link: false,  // StarterKitのlinkを無効化（カスタム設定を使用）
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      LinkPreview,
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
        editor.chain().focus().setImage({
          src: url,
          style: 'width: 500px; max-width: 100%; height: auto; display: block; margin: 1rem auto;'
        }).run()
      }
    }
  }

  const updateImageSize = (width: string) => {
    if (!editor) return

    const { node } = editor.state.selection as any
    if (node && node.type.name === 'image') {
      const style = `width: ${width}; max-width: 100%; height: auto; display: block; margin: 1rem auto;`
      editor.chain().focus().updateAttributes('image', { style }).run()
    } else {
      // 画像が選択されていない場合
      alert('サイズを変更したい画像をクリックして選択してください')
    }
    setShowImageSizeDialog(false)
  }

  const setLink = () => {
    setShowLinkDialog(true)
  }

  const insertSimpleLink = () => {
    const { from, to } = editor?.state.selection || { from: 0, to: 0 }
    const hasSelection = from !== to
    const previousUrl = editor?.getAttributes('link').href

    // テキストが選択されている場合
    if (hasSelection) {
      const url = window.prompt('リンクのURLを入力してください:', previousUrl)

      if (url === null) {
        return
      }

      if (url === '') {
        editor?.chain().focus().extendMarkRange('link').unsetLink().run()
        setShowLinkDialog(false)
        return
      }

      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
    // テキストが選択されていない場合
    else {
      const linkText = window.prompt('リンクテキストを入力してください:')

      if (!linkText) {
        return
      }

      const url = window.prompt('リンク先のURLを入力してください:')

      if (!url) {
        return
      }

      // 新しいリンクテキストを挿入
      editor
        ?.chain()
        .focus()
        .insertContent({
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: url,
              },
            },
          ],
          text: linkText,
        })
        .run()
    }
    setShowLinkDialog(false)
  }

  const insertLinkPreview = async () => {
    const url = window.prompt('プレビューを表示するURLを入力してください:')

    if (!url) {
      return
    }

    // URL表示の有無を確認
    const showUrl = window.confirm(
      'プレビューカードにURL（ドメイン名）を表示しますか？\n\n' +
      '「OK」: タイトル + URL表示\n' +
      '「キャンセル」: タイトルのみ表示'
    )

    setIsLoadingPreview(true)

    try {
      // メタデータを取得
      const response = await fetch('/api/link-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('メタデータの取得に失敗しました')
      }

      const metadata: LinkPreviewAttributes = await response.json()

      // showUrlオプションを追加
      metadata.showUrl = showUrl

      // LinkPreviewノードを挿入
      editor?.chain().focus().setLinkPreview(metadata).run()
    } catch (error) {
      console.error('Link preview error:', error)
      alert('リンクプレビューの取得に失敗しました。通常のリンクとして挿入してください。')
    } finally {
      setIsLoadingPreview(false)
      setShowLinkDialog(false)
    }
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
            title="リンクを挿入（テキスト選択時：選択範囲にリンク / 未選択時：新規リンク作成）"
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
            onClick={() => setShowImageSizeDialog(true)}
            title="画像サイズを変更"
          >
            <Maximize2 className="w-4 h-4" />
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
        <div className="flex flex-col space-y-1">
          <div>🔗 <strong>リンクプレビュー:</strong> リンクボタンをクリック → 「リンクプレビューカード」を選択 → URLを入力すると、自動でタイトル・説明・画像を取得</div>
          <div>🖼️ <strong>画像サイズ変更:</strong> 画像をクリックして選択 → ツールバーの「画像サイズを変更」ボタン（⛶）をクリック → サイズを選択</div>
          <div>💡 <strong>ヒント:</strong> 見出しや箇条書きを使って読みやすい構成を心がけましょう。</div>
        </div>
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

      {/* Link Dialog */}
      <AnimatePresence>
        {showLinkDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowLinkDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              {/* Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link2 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">リンクを挿入</h3>
                </div>
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Options */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  リンクの表示方法を選択してください
                </p>

                <div className="space-y-3">
                  {/* 通常のテキストリンク */}
                  <button
                    onClick={insertSimpleLink}
                    disabled={isLoadingPreview}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start space-x-3">
                      <Link2 className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 group-hover:text-blue-600 mb-1">
                          通常のテキストリンク
                        </div>
                        <p className="text-sm text-gray-600">
                          シンプルなテキストリンクを挿入します
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* リンクプレビューカード */}
                  <button
                    onClick={insertLinkPreview}
                    disabled={isLoadingPreview}
                    className="w-full p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start space-x-3">
                      <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 group-hover:text-blue-600 mb-1">
                          リンクプレビューカード（推奨）
                        </div>
                        <p className="text-sm text-gray-600">
                          画像・タイトル・説明付きのカードを表示します
                        </p>
                      </div>
                    </div>
                    {isLoadingPreview && (
                      <div className="mt-3 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-sm text-gray-600">メタデータを取得中...</span>
                      </div>
                    )}
                  </button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    💡 <strong>おすすめ:</strong> 外部サイトへのリンクはプレビューカードを使うと、読者にとってわかりやすくなります。
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Size Dialog */}
      <AnimatePresence>
        {showImageSizeDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowImageSizeDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              {/* Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Maximize2 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">画像サイズを変更</h3>
                </div>
                <button
                  onClick={() => setShowImageSizeDialog(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Size Options */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  サイズを変更したい画像をクリックして選択してから、以下のサイズを選んでください。
                </p>
                <div className="space-y-2">
                  {imageSizeOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => updateImageSize(option.width)}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 group-hover:text-blue-600">
                          {option.label}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {option.width}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    💡 <strong>ヒント:</strong> 画像をクリックすると青い枠が表示され、選択されます。
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
