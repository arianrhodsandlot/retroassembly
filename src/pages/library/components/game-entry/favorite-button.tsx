import { IconButton } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { attemptAsync } from 'es-toolkit'
import { useState, type MouseEvent } from 'react'
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
  const [optimisticFavorite, setOptimisticFavorite] = useState<boolean | null>(null)

  const { isMutating: isAdding, trigger: triggerAdd } = useSWRMutation(
    { endpoint: 'favorites', method: 'post', romId: rom.id },
    () => parseResponse(client.favorites.$post({ json: { romId: rom.id } })),
  )

  const { isMutating: isRemoving, trigger: triggerRemove } = useSWRMutation(
    { endpoint: 'favorites', method: 'delete', romId: rom.id },
    () => client.favorites[':romId'].$delete({ param: { romId: rom.id } }),
  )

  const isLoading = isAdding || isRemoving
  const isFavorite = optimisticFavorite ?? rom.isFavorite

  async function handleClick(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (isLoading) {
      return
    }
    const nextFavorite = !isFavorite
    setOptimisticFavorite(nextFavorite)
    const [error] = isFavorite ? await attemptAsync(() => triggerRemove()) : await attemptAsync(() => triggerAdd())
    if (error) {
      setOptimisticFavorite(rom.isFavorite)
      return
    }
    await reloadSilently()
    setOptimisticFavorite(null)
  }

  return (
    <div
      className={clsx(isOverlay ? 'absolute top-1 left-1 z-10 transition-opacity' : 'inline-flex', {
        'group-hover:opacity-100': isOverlay && !isFavorite,
        'opacity-0': isOverlay && !isFavorite,
      })}
    >
      <IconButton
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        className={clsx({ 'bg-(--gray-1)!': isOverlay })}
        loading={isLoading}
        onClick={handleClick}
        size={isOverlay ? '1' : '2'}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        variant='ghost'
      >
        <span
          className={clsx('text-(--accent-9)', {
            'icon-[mdi--star-outline]': !isFavorite,
            'icon-[mdi--star]': isFavorite,
          })}
        />
      </IconButton>
    </div>
  )
}
