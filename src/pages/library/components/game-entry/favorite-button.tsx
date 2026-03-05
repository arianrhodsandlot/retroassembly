import { IconButton } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useOptimistic, useTransition } from 'react'
import useSWRMutation from 'swr/mutation'
import { client, parseResponse } from '#@/api/client.ts'
import type { Rom } from '#@/controllers/roms/get-roms.ts'
import { useRouter } from '../../hooks/use-router.ts'

interface FavoriteButtonProps {
  rom: Rom
  variant?: 'inline' | 'overlay'
}

export function FavoriteButton({ rom, variant = 'overlay' }: Readonly<FavoriteButtonProps>) {
  const { reloadSilently } = useRouter()
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
      await reloadSilently()
    })
  }

  return (
    <div
      className={clsx(isOverlay ? 'absolute top-1 left-1 z-10 transition-opacity' : 'inline-flex', {
        'group-hover:opacity-100': isOverlay && !optimisticIsFavorite,
        'opacity-0': isOverlay && !optimisticIsFavorite,
      })}
    >
      <IconButton
        aria-label={optimisticIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
        className={clsx({ 'bg-(--gray-1)!': isOverlay })}
        loading={isPending}
        onClick={handleClick}
        size={isOverlay ? '1' : '2'}
        title={optimisticIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
        variant='ghost'
      >
        <span
          className={clsx('text-(--accent-9)', {
            'icon-[mdi--star-outline]': !optimisticIsFavorite,
            'icon-[mdi--star]': optimisticIsFavorite,
          })}
        />
      </IconButton>
    </div>
  )
}
