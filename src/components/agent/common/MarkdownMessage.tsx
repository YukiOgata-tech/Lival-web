'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

export default function MarkdownMessage({ text }: { text: string }) {
  return (
    <div className="prose max-w-none text-gray-900 prose-headings:mb-2 prose-p:my-2 prose-code:px-1 prose-pre:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" />,
          code: ({ inline, className, children, ...props }) => (
            inline ? (
              <code className="not-prose rounded bg-gray-100 px-1 py-0.5" {...props}>{children}</code>
            ) : (
              <pre className="not-prose rounded-md bg-gray-900 text-gray-100 p-3 overflow-x-auto"><code {...props}>{children}</code></pre>
            )
          ),
        }}
      >
        {text || ''}
      </ReactMarkdown>
    </div>
  )
}
