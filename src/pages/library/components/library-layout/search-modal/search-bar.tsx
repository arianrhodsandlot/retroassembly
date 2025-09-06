import clsx from 'clsx'
import { debounce } from 'es-toolkit'
import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import useSWRMutation from 'swr/mutation'
import { useSpatialNavigationPaused } from '@/pages/library/atoms.ts'
import { useInputMapping } from '@/pages/library/hooks/use-input-mapping.ts'
import { Gamepad } from '@/utils/gamepad.ts'
import { api } from '@/utils/http.ts'
import { useShowSearchModal } from '../atoms.ts'
import { useSelectedResult } from './atoms.ts'
import { SearchInput } from './search-input.tsx'
import { SearchResults } from './search-results.tsx'

export function SearchBar() {
  const navitate = useNavigate()
  const inputMapping = useInputMapping()
  const [, setShowSearchModal] = useShowSearchModal()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()

  const [query, setQuery] = useState('')
  const [selectedResult, setSelectedResult] = useSelectedResult()
  const { data, isMutating, trigger } = useSWRMutation('roms/search', (url, { arg: query }: { arg: string }) =>
    query ? api(url, { searchParams: { page_size: 10, query } }).json<any>() : null,
  )

  const select = useCallback(
    function select() {
      if (selectedResult) {
        setShowSearchModal(false)
        setSpatialNavigationPaused(false)
        const url = `/library/platform/${encodeURIComponent(selectedResult.platform)}/rom/${encodeURIComponent(selectedResult.fileName)}`
        navitate(url)
      }
    },
    [selectedResult, setShowSearchModal, setSpatialNavigationPaused, navitate],
  )

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    select()
  }

  const handleChange = useMemo(
    () =>
      debounce(async function handleChange(value: string) {
        const trimmedValue = value.trim()
        setQuery(trimmedValue)
        const { roms } = await trigger(trimmedValue)
        setSelectedResult(roms[0])
      }, 300),
    [trigger, setSelectedResult],
  )

  const move = useCallback(
    function move(direction: 'down' | 'up') {
      if (data?.roms?.length) {
        setSelectedResult((prev) => {
          const currentIndex = data.roms.indexOf(prev)
          const nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1
          return data.roms[(nextIndex + data.roms.length) % data.roms.length]
        })
      }
    },
    [data?.roms, setSelectedResult],
  )

  useEffect(() => {
    const abortController = new AbortController()

    document.body.addEventListener(
      'keydown',
      (event) => {
        if (event.code === 'ArrowDown') {
          event.preventDefault()
          move('down')
        } else if (event.code === 'ArrowUp') {
          event.preventDefault()
          move('up')
        }
      },
      { signal: abortController.signal },
    )

    return () => {
      abortController.abort()
    }
  }, [move])

  useEffect(() => {
    return Gamepad.onPress(({ button }) => {
      if (`${button}` === inputMapping.gamepad.input_player1_down_btn) {
        move('down')
      }
      if (`${button}` === inputMapping.gamepad.input_player1_up_btn) {
        move('up')
      }
      if (`${button}` === inputMapping.confirmButton) {
        select()
      }
    })
  }, [move, inputMapping, select])

  return (
    <div className='z-1 w-2xl pointer-events-auto relative mx-auto mt-16 text-xl shadow-2xl'>
      <form
        className={clsx('border-(--accent-9) bg-(--color-background) w-full overflow-hidden rounded-t border-2', {
          'rounded-b': !data,
        })}
        onSubmit={handleSubmit}
      >
        <SearchInput isMutating={isMutating} onChange={handleChange} />
      </form>

      <SearchResults loading={isMutating} query={query} results={data?.roms} />
    </div>
  )
}
