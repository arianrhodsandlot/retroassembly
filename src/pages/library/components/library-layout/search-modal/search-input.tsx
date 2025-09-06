import { useState } from 'react'

interface SearchInputProps {
  isMutating: boolean
  onChange: (value: string) => void
}

export function SearchInput({ isMutating, onChange }: Readonly<SearchInputProps>) {
  const [composing, setComposing] = useState(false)

  return (
    <label className='flex items-center gap-2 p-2' htmlFor='query'>
      <div className='flex size-12 items-center justify-center'>
        {isMutating ? <span className='icon-[mdi--loading] animate-spin' /> : <span className='icon-[mdi--search]' />}
      </div>
      <input
        autoFocus
        className='flex-1 outline-0'
        onChange={(event) => {
          if (!composing) {
            onChange(event.currentTarget.value)
          }
        }}
        onCompositionEnd={(event) => {
          onChange(event.currentTarget.value)
          setComposing(false)
        }}
        onCompositionStart={() => {
          setComposing(true)
        }}
        placeholder='Search for games...'
        spellCheck={false}
        title='Search'
        type='text'
      />
    </label>
  )
}
