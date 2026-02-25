import { clsx } from 'clsx'
import { useCallback, useEffect, type SubmitEvent } from 'react'
import { useLoaderData, useLocation, useNavigate } from 'react-router'
import useSWR from 'swr'
import { client, parseResponse } from '#@/api/client.ts'
import { useSpatialNavigationPaused } from '#@/pages/library/atoms.ts'
import { useInputMapping } from '#@/pages/library/hooks/use-input-mapping.ts'
import { Gamepad } from '#@/utils/client/gamepad.ts'
import type { getLibraryLoaderData } from '#@/utils/server/loader-data.ts'
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

  const { recentlyLaunchedRoms } = useLoaderData<typeof getLibraryLoaderData>()
  const [query] = useQuery()
  const [selectedResult, setSelectedResult] = useSelectedResult()

  const { data, isLoading: isMutating } = useSWR(
    query ? { endpoint: 'roms/search', query: { page_size: '10', query } } : null,
    ({ query }) => parseResponse($get({ query })),
    { dedupingInterval: 5 * 60 * 1000, keepPreviousData: true, revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  const displayResults = query ? data?.roms : recentlyLaunchedRoms

  const selectedUrl = selectedResult
    ? `/library/platform/${encodeURIComponent(selectedResult.platform)}/rom/${encodeURIComponent(selectedResult.fileName)}`
    : ''
  const select = useCallback(
    async function select() {
      if (selectedUrl) {
        setShowSearchModal(false)
        setSpatialNavigationPaused(false)
        if (selectedUrl !== location.pathname) {
          await navigate(selectedUrl)
        }
      }
    },
    [location.pathname, selectedUrl, setShowSearchModal, setSpatialNavigationPaused, navigate],
  )

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    await select()
  }

  const move = useCallback(
    function move(direction: 'down' | 'up') {
      if (displayResults?.length) {
        const index = displayResults.indexOf(selectedResult)
        const newIndex = ({ down: index + 1, up: index - 1 }[direction] + displayResults.length) % displayResults.length
        setSelectedResult(displayResults[newIndex])
      }
    },
    [displayResults, selectedResult, setSelectedResult],
  )

  useEffect(() => {
    setSelectedResult(displayResults?.[0])
  }, [displayResults, setSelectedResult])

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

  useEffect(
    () =>
      Gamepad.onPress(async ({ button }) => {
        if (`${button}` === inputMapping.gamepad.input_player1_down_btn) {
          move('down')
        }
        if (`${button}` === inputMapping.gamepad.input_player1_up_btn) {
          move('up')
        }
        if (`${button}` === inputMapping.confirmButton) {
          await select()
        }
      }),
    [move, inputMapping, select],
  )

  return (
    <div
      className={clsx(
        'pointer-events-none fixed left-1/2 z-1 flex w-2xl max-w-full -translate-x-1/2 flex-col overflow-hidden px-2 text-xl',
        query && displayResults?.length ? 'inset-y-14' : 'top-14',
      )}
    >
      <form
        className={clsx(
          'pointer-events-auto w-full shrink-0 overflow-hidden rounded-t border-2 border-(--accent-9) bg-(--color-background)',
          { 'rounded-b': !query },
        )}
        onSubmit={handleSubmit}
      >
        <SearchInput isMutating={isMutating} />
      </form>

      <div
        className={clsx(
          'w-full overflow-auto rounded-b border-x-2 border-b-2 border-(--accent-9) bg-(--color-background) transition-opacity *:pointer-events-auto empty:hidden',
          { '*:opacity-50': query && data?.query !== query },
        )}
      >
        <SearchResults keyword={query} loading={isMutating} results={displayResults} />
      </div>
    </div>
  )
}
