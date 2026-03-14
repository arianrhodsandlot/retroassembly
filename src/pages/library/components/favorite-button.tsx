import { clsx } from 'clsx'
import { useOptimistic, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client } from '#@/api/client.ts'
import type { Rom } from '#@/controllers/roms/get-roms.ts'
import { useRouter } from '../hooks/use-router.ts'

interface FavoriteButtonProps {
  rom: Rom
  variant: 'inline' | 'overlay'
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

  function handleClick() {
    if (isPending) {
      return
    }

    const nextFavorite = !optimisticIsFavorite

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
