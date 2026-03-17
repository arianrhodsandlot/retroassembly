import confetti from 'canvas-confetti'
import { clsx } from 'clsx'
import { useOptimistic, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client } from '#@/api/client.ts'
import { metadata } from '#@/constants/metadata.ts'
import type { Rom } from '#@/controllers/roms/get-roms.ts'
import { useRouter } from '../hooks/use-router.ts'

interface FavoriteButtonProps {
  rom: Rom
  variant: 'inline' | 'overlay'
}

const heartPath =
  'm12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z'
async function showConfetti(element: HTMLElement, isTop: boolean) {
  const rect = element.getBoundingClientRect()
  const x = (rect.left + rect.width / 2) / globalThis.innerWidth
  const y = (rect.top + rect.height / 2) / globalThis.innerHeight
  const origin = { x, y }
  await confetti({
    colors: [metadata.themeColor],
    disableForReducedMotion: true,
    gravity: isTop ? -0.5 : 0.5,
    origin,
    particleCount: 1,
    scalar: 1.5,
    shapes: [confetti.shapeFromPath(heartPath)],
    spread: 0,
    startVelocity: 0,
    ticks: 40,
  })
}
export function FavoriteButton({ rom, variant }: Readonly<FavoriteButtonProps>) {
  const { t } = useTranslation()
  const { reload } = useRouter()
  const isOverlay = variant === 'overlay'
  const [isPending, startTransition] = useTransition()
  const [optimisticIsFavorite, setOptimisticIsFavorite] = useOptimistic(
    rom.isFavorite,
    (_, nextState: boolean) => nextState,
  )

  const endpoint = client.favorites.$url({ param: { romId: rom.id } })
  const { trigger: add } = useSWRMutation({ endpoint, method: 'post' }, () =>
    client.favorites.$post({ json: { romId: rom.id } }),
  )

  const { trigger: remove } = useSWRMutation({ endpoint, method: 'delete' }, () =>
    client.favorites[':romId'].$delete({ param: { romId: rom.id } }),
  )

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (isPending) {
      return
    }

    const nextFavorite = !optimisticIsFavorite

    // oxlint-disable-next-line typescript/no-floating-promises
    showConfetti(event.currentTarget, nextFavorite)

    startTransition(async () => {
      setOptimisticIsFavorite(nextFavorite)
      const prommise = rom.isFavorite ? remove() : add()
      await prommise
      await reload()
    })
  }

  return (
    <div
      className={clsx({
        'group-hover:opacity-100 lg:opacity-0': isOverlay && !optimisticIsFavorite,
        'pointer-events-none absolute inset-0 transition-opacity': isOverlay,
      })}
    >
      <div className={isOverlay ? 'absolute aspect-square w-full' : ''}>
        <div className={isOverlay ? 'absolute right-1 bottom-6' : ''}>
          <button
            type='button'
            className='pointer-events-auto relative z-1 flex rounded-full bg-(--color-background) p-1.5 ring-1 ring-(--gray-4) hover:bg-(--accent-3) hover:ring-(--accent-3)'
            aria-label={optimisticIsFavorite ? t('game.removeFromFavorites') : t('game.addToFavorites')}
            onClick={handleClick}
            title={optimisticIsFavorite ? t('game.removeFromFavorites') : t('game.addToFavorites')}
          >
            <span
              className={clsx('text-lg text-(--accent-9)', {
                'icon-[mdi--heart-outline]': !optimisticIsFavorite,
                'icon-[mdi--heart]': optimisticIsFavorite,
              })}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
