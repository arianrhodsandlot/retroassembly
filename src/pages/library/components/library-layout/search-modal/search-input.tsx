import { debounce } from 'es-toolkit'
import { type ChangeEvent, useMemo, useState } from 'react'
import { useSpatialNavigationPaused } from '@/pages/library/atoms.ts'
import { useShowSearchModal } from '../atoms.ts'
import { useQuery } from './atoms.ts'

interface SearchInputProps {
  isMutating: boolean
}

export function SearchInput({ isMutating }: Readonly<SearchInputProps>) {
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()
  const [, setShowSearchModal] = useShowSearchModal()
  const [query, setQuery] = useQuery()

  const [composing, setComposing] = useState(false)

  const handleChange = useMemo(
    () =>
      debounce((event: ChangeEvent<HTMLInputElement>) => {
        if (!composing) {
          setQuery(event.target.value.trim())
        }
      }, 200),
    [composing, setQuery],
  )

  function handleClickClose() {
    setShowSearchModal(false)
    setSpatialNavigationPaused(false)
  }

  return (
    <label className='flex items-center gap-2 p-2'>
      <div className='flex size-12 items-center justify-center'>
        {isMutating ? <span className='icon-[mdi--loading] animate-spin' /> : <span className='icon-[mdi--search]' />}
      </div>

      <input
        aria-label='Search'
        autoComplete='off'
        autoFocus
        className='flex-1 outline-0'
        defaultValue={query}
        name='query'
        onChange={handleChange}
        onCompositionEnd={(event) => {
          setComposing(false)
          setQuery(event.currentTarget.value.trim())
        }}
        onCompositionStart={() => {
          setComposing(true)
        }}
        spellCheck={false}
        type='text'
      />

      <button
        className='flex size-12 items-center justify-center'
        onClick={handleClickClose}
        title='Close'
        type='button'
      >
        <span className='icon-[mdi--close]' />
      </button>
    </label>
  )
}
