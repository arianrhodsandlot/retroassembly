import { Button } from '@radix-ui/themes'
import { useState } from 'react'

interface CodeBlockProps {
  readonly className?: string
  readonly code: string
}

export function CodeBlock({ className, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='group relative'>
      <pre className={className}>
        <code className='font-mono'>{code}</code>
      </pre>
      <Button
        className='absolute! right-4! top-3! opacity-0 transition-opacity group-hover:opacity-100'
        onClick={handleCopy}
        size='1'
        variant='ghost'
      >
        {copied ? (
          <span className='icon-[mdi--check] text-(--green-11) text-lg' />
        ) : (
          <span className='icon-[mdi--content-copy] text-lg' />
        )}
      </Button>
    </div>
  )
}
