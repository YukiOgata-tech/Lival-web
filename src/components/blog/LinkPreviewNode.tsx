// src/components/blog/LinkPreviewNode.tsx
'use client'

import { Node, mergeAttributes } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { ExternalLink, Globe, Trash2 } from 'lucide-react'

export interface LinkPreviewAttributes {
  url: string
  title?: string
  description?: string
  image?: string
  siteName?: string
  favicon?: string
  showUrl?: boolean  // URLを表示するかどうか（デフォルト: true）
}

// Reactコンポーネント
function LinkPreviewComponent(props: any) {
  const { node, deleteNode, editor } = props
  const { url, title, description, image, siteName, showUrl = true } = node.attrs as LinkPreviewAttributes

  return (
    <NodeViewWrapper className="link-preview-wrapper">
      <div className="my-4 not-prose">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200 no-underline group"
        >
          <div className="flex flex-col sm:flex-row">
            {/* サムネイル画像 */}
            {image && (
              <div className="sm:w-48 sm:flex-shrink-0">
                <img
                  src={image}
                  alt={title || 'Link preview'}
                  className="w-full h-48 sm:h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* コンテンツ */}
            <div className="flex-1 p-4">
              {/* サイト名 */}
              {siteName && (
                <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                  <Globe className="w-3 h-3" />
                  <span>{siteName}</span>
                </div>
              )}

              {/* タイトル */}
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                {title || url}
              </h3>

              {/* 説明 */}
              {description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {description}
                </p>
              )}

              {/* URL表示（オプション） */}
              {showUrl && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-blue-600">
                    <ExternalLink className="w-3 h-3" />
                    <span className="truncate">{new URL(url).hostname}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </a>

        {/* 削除ボタン（編集時のみ） */}
        {editor?.isEditable && (
          <button
            onClick={deleteNode}
            className="mt-2 inline-flex items-center space-x-1 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-md transition-colors"
            title="リンクプレビューを削除"
          >
            <Trash2 className="w-3 h-3" />
            <span>削除</span>
          </button>
        )}
      </div>
    </NodeViewWrapper>
  )
}

// Tiptap Node拡張
export const LinkPreview = Node.create({
  name: 'linkPreview',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      url: {
        default: '',
      },
      title: {
        default: '',
      },
      description: {
        default: '',
      },
      image: {
        default: '',
      },
      siteName: {
        default: '',
      },
      favicon: {
        default: '',
      },
      showUrl: {
        default: true,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="link-preview"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const { url, title, description, image, siteName, showUrl = true } = node.attrs

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'link-preview',
        class: 'link-preview-wrapper',
      }),
      [
        'a',
        {
          href: url,
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'block border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200 no-underline',
        },
        [
          'div',
          { class: 'flex flex-col sm:flex-row' },
          ...(image
            ? [
                [
                  'div',
                  { class: 'sm:w-48 sm:flex-shrink-0' },
                  [
                    'img',
                    {
                      src: image,
                      alt: title || 'Link preview',
                      class: 'w-full h-48 sm:h-full object-cover',
                      loading: 'lazy',
                    },
                  ],
                ],
              ]
            : []),
          [
            'div',
            { class: 'flex-1 p-4' },
            ...(siteName
              ? [
                  [
                    'div',
                    { class: 'flex items-center space-x-1 text-xs text-gray-500 mb-2' },
                    ['span', {}, siteName],
                  ],
                ]
              : []),
            [
              'h3',
              {
                class:
                  'font-semibold text-gray-900 line-clamp-2 mb-2',
              },
              title || url,
            ],
            ...(description
              ? [
                  [
                    'p',
                    { class: 'text-sm text-gray-600 line-clamp-2 mb-3' },
                    description,
                  ],
                ]
              : []),
            ...(showUrl
              ? [
                  [
                    'div',
                    { class: 'flex items-center space-x-1 text-xs text-blue-600' },
                    ['span', { class: 'truncate' }, new URL(url).hostname],
                  ],
                ]
              : []),
          ],
        ],
      ],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkPreviewComponent)
  },

  addCommands() {
    return {
      setLinkPreview:
        (attributes: LinkPreviewAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },
    }
  },
})
