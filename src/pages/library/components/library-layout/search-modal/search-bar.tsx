import { clsx } from 'clsx'
import { type FormEvent, useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import useSWR from 'swr'
import { client, parseResponse } from '@/api/client.ts'
import { useSpatialNavigationPaused } from '@/pages/library/atoms.ts'
import { useInputMapping } from '@/pages/library/hooks/use-input-mapping.ts'
import { Gamepad } from '@/utils/client/gamepad.ts'
import { useShowSearchModal } from '../atoms.ts'
import { useQuery, useSelectedResult } from './atoms.ts'
import { SearchInput } from './search-input.tsx'
import { SearchResults } from './search-results.tsx'

const { $get } = client.roms.search

export function SearchBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const inputMapping = useInputMapping()
  const [, setShowSearchModal] = useShowSearchModal()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()

  const [query] = useQuery()
  const [selectedResult, setSelectedResult] = useSelectedResult()

  const { data, isLoading: isMutating } = useSWR(
    query ? { endpoint: 'roms/search', query: { page_size: '10', query } } : null,
    ({ query }) => parseResponse($get({ query })),
    { dedupingInterval: 5 * 60 * 1000, keepPreviousData: true, revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  const selectedUrl = selectedResult
    ? `/library/platform/${encodeURIComponent(selectedResult.platform)}/rom/${encodeURIComponent(selectedResult.fileName)}`
    : ''
  const select = useCallback(
    function select() {
      if (selectedUrl) {
        setShowSearchModal(false)
        setSpatialNavigationPaused(false)
        if (selectedUrl !== location.pathname) {
          navigate(selectedUrl)
        }
      }
    },
    [location.pathname, selectedUrl, setShowSearchModal, setSpatialNavigationPaused, navigate],
  )

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    select()
  }

  const move = useCallback(
    function move(direction: 'down' | 'up') {
      if (data?.roms?.length) {
        const index = data.roms.indexOf(selectedResult)
        const newIndex = ({ down: index + 1, up: index - 1 }[direction] + data.roms.length) % data.roms.length
        setSelectedResult(data.roms[newIndex])
      }
    },
    [data?.roms, selectedResult, setSelectedResult],
  )

  useEffect(() => {
    setSelectedResult(data?.roms?.[0])
  }, [data?.roms, setSelectedResult])

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
    <div
      className={clsx(
        'z-1 w-2xl pointer-events-none fixed left-1/2 flex max-w-full -translate-x-1/2 flex-col overflow-hidden px-2 text-xl',
        query && data?.roms?.length ? 'inset-y-14' : 'top-14',
      )}
    >
      <form
        className={clsx(
          'border-(--accent-9) bg-(--color-background) pointer-events-auto w-full shrink-0 overflow-hidden rounded-t border-2',
          { 'rounded-b': !query },
        )}
        onSubmit={handleSubmit}
      >
        <SearchInput isMutating={isMutating} />
      </form>

      <div
        className={clsx(
          'border-(--accent-9) bg-(--color-background) w-full overflow-auto rounded-b border-x-2 border-b-2 transition-opacity *:pointer-events-auto empty:hidden',
          { '*:opacity-50': data?.query !== query },
        )}
      >
        <SearchResults keyword={data?.query ?? ''} loading={isMutating} results={data?.roms} />
      </div>
    </div>
  )
}
