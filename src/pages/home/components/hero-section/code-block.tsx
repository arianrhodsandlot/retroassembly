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
        className='absolute! top-3! right-4! opacity-0 transition-opacity group-hover:opacity-100'
        onClick={handleCopy}
        size='1'
        variant='ghost'
      >
        {copied ? (
          <span className='icon-[mdi--check] text-lg text-(--green-11)' />
        ) : (
          <span className='icon-[mdi--content-copy] text-lg' />
        )}
      </Button>
    </div>
  )
}
