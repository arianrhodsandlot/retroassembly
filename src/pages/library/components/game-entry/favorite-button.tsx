import { clsx } from 'clsx'
import { useOptimistic, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client, parseResponse } from '#@/api/client.ts'
import type { Rom } from '#@/controllers/roms/get-roms.ts'
import { useRouter } from '../../hooks/use-router.ts'

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

  const { trigger: triggerAdd } = useSWRMutation({ endpoint: 'favorites', method: 'post', romId: rom.id }, () =>
    parseResponse(client.favorites.$post({ json: { romId: rom.id } })),
  )

  const { trigger: triggerRemove } = useSWRMutation({ endpoint: 'favorites', method: 'delete', romId: rom.id }, () =>
    client.favorites[':romId'].$delete({ param: { romId: rom.id } }),
  )

  function handleClick() {
    if (isPending) {
      return
    }

    const nextFavorite = !optimisticIsFavorite

    startTransition(async () => {
      setOptimisticIsFavorite(nextFavorite)
      const prommise = rom.isFavorite ? triggerRemove() : triggerAdd()
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
            className='pointer-events-auto relative z-1 flex rounded-full bg-(--color-background) p-1.5 ring-1 ring-(--gray-4) hover:bg-(--accent-5) hover:ring-(--accent-5)'
            aria-label={optimisticIsFavorite ? t('Remove from favorites') : t('Add to favorites')}
            onClick={handleClick}
            title={optimisticIsFavorite ? t('Remove from favorites') : t('Add to favorites')}
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
