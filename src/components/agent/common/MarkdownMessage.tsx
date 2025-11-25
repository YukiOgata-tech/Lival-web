'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

/**
 * 不完全な数式デリミタを自動修正
 * LLMが出力する不正なLaTeX形式を修正
 */
function fixIncompleteLatex(text: string): string {
  if (!text) return text

  let fixed = text

  // パターン1: \(...\) 形式のインライン数式を $...$ に変換（シングルドル）
  fixed = fixed.replace(/\\\((.*?)\\\)/g, (match, content) => `$${content}$`)

  // パターン2: \[...\] 形式のブロック数式を $$...$$ に変換（ダブルドル）
  fixed = fixed.replace(/\\\[([\s\S]*?)\\\]/g, (match, content) => {
    // 内容の改行と余分な空白を1つのスペースに置き換え（1行にする）
    const oneLine = content.replace(/\s+/g, ' ').trim()
    return `$$${oneLine}$$`
  })

  // パターン3: \displaystyle $$...$$ → $$\displaystyle ...$$ （外側の\displaystyleを内側に移動）
  fixed = fixed.replace(/\\displaystyle\s+\$\$(.*?)\$\$/g, '$$\\displaystyle $1$$')

  // パターン6: \begin{環境}...\end{環境}$$ の形式（先頭に$$がない）
  fixed = fixed.replace(
    /(^|[^$])(\\begin\{[^}]+\}[\s\S]*?\\end\{[^}]+\})\$\$/g,
    (match, prefix, content) => {
      return `${prefix}$$${content}$$`
    }
  )

  // パターン7: \で始まる数式が$$で終わる（先頭に$$がない）
  fixed = fixed.replace(
    /(^|\n| )(\\[a-zA-Z]+[^$]*?)\$\$/gm,
    (match, prefix, content) => {
      const fullMatch = prefix + content + '$$'
      if (fullMatch.startsWith('$$') || content.includes('$$')) {
        return match
      }
      if (content.includes('\\')) {
        return `${prefix}$$${content}$$`
      }
      return match
    }
  )

  // パターン8: $$$$ の重複を修正
  fixed = fixed.replace(/\$\$\$\$+/g, '$$')

  // パターン9: 空の$$を削除
  fixed = fixed.replace(/\$\$\s*\$\$/g, '')

  return fixed
}

export default function MarkdownMessage({ text }: { text: string }) {
  // 数式の自動修正を適用
  const fixedText = fixIncompleteLatex(text)

  return (
    <div className="prose prose-sm sm:prose-base max-w-none text-gray-900 prose-headings:mb-3 prose-headings:mt-4 prose-p:my-3 prose-p:leading-relaxed prose-code:text-sm prose-code:px-1.5 prose-code:py-0.5 prose-pre:p-0 prose-ul:my-2 prose-ol:my-2 prose-li:my-1">
      <style jsx global>{`
        /* KaTeX 数式のスタイリング強化 */
        .katex {
          font-size: 1.1em !important;
        }

        /* ブロック数式（display math）のスタイリング */
        .katex-display {
          margin: 1.5em 0 !important;
          padding: 1em !important;
          background: #f8f9fa !important;
          border-radius: 8px !important;
          border-left: 4px solid #4ade80 !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
        }

        .katex-display > .katex {
          font-size: 1.15em !important;
        }

        /* インライン数式のスタイリング */
        .katex:not(.katex-display .katex) {
          padding: 0.1em 0.2em !important;
        }

        /* 数式内のテキストの可読性向上 */
        .katex .base {
          line-height: 1.6 !important;
        }

        /* スクロール可能な数式の視覚的フィードバック */
        .katex-display::-webkit-scrollbar {
          height: 6px;
        }

        .katex-display::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 3px;
        }

        .katex-display::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 3px;
        }

        .katex-display::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
        rehypePlugins={[rehypeKatex]}
        components={{
          a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline" />,
          code: ({ inline, className, children, ...props }) => (
            inline ? (
              <code className="not-prose rounded bg-gray-100 text-gray-900 px-1.5 py-0.5 font-mono text-sm" {...props}>{children}</code>
            ) : (
              <pre className="not-prose rounded-lg bg-gray-900 text-gray-100 p-4 overflow-x-auto my-3"><code className="font-mono text-sm" {...props}>{children}</code></pre>
            )
          ),
          // 数式ブロックの最適化
          p: (props) => <p className="leading-relaxed my-3" {...props} />,
          // リストの最適化
          ul: (props) => <ul className="list-disc pl-6 my-2 space-y-1" {...props} />,
          ol: (props) => <ol className="list-decimal pl-6 my-2 space-y-1" {...props} />,
          li: (props) => <li className="leading-relaxed" {...props} />,
        }}
      >
        {fixedText || ''}
      </ReactMarkdown>
    </div>
  )
}
