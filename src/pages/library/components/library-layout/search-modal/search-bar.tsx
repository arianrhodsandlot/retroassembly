import { debounce } from 'es-toolkit'
import { useMemo, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { api } from '@/utils/http.ts'
import { SearchResults } from './search-results.tsx'

export function SearchBar() {
  const [composing, setComposing] = useState(false)

  const { data, isMutating, trigger } = useSWRMutation('roms/search', (url, { arg }: { arg: { query: string } }) =>
    arg.query.trim() ? api(url, { searchParams: { page_size: 5, query: arg.query.trim() } }).json() : null,
  )

  const search = useMemo(() => debounce((query) => trigger({ query }), 300), [trigger])

  return (
    <div className='z-1 w-2xl bg-(--color-background) pointer-events-auto relative mx-auto mt-32 text-xl shadow-2xl'>
      <form className='border-(--accent-9) w-full rounded-t border-2'>
        <label className='flex items-center gap-2 p-2' htmlFor='query'>
          <div className='flex size-12 items-center justify-center'>
            {isMutating ? (
              <span className='icon-[mdi--loading] animate-spin' />
            ) : (
              <span className='icon-[mdi--search]' />
            )}
          </div>
          <input
            autoFocus
            className='flex-1 outline-0'
            onChange={(event) => {
              if (!composing) {
                search(event.currentTarget.value)
              }
            }}
            onCompositionEnd={(event) => {
              search(event.currentTarget.value)
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
      </form>

      {data ? (
        <ul className='border-(--accent-9) -mt-0.5 max-h-80 overflow-y-auto rounded-b border-2'>
          <SearchResults searchResults={data} />
        </ul>
      ) : null}
    </div>
  )
}
