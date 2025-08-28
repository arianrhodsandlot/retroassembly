import { Button } from '@radix-ui/themes'
import { range } from 'es-toolkit'
import type { RomsPagination } from '@/controllers/get-roms'
import { NavigatableLink } from '../navigatable-link.tsx'

export function GameListPagination({ pagination }: Readonly<{ pagination: RomsPagination }>) {
  const { current, pages } = pagination

  if (pages <= 1) {
    return
  }

  return (
    <ul className='mt-4 flex flex-wrap justify-center gap-2 px-10'>
      {range(1, pages + 1).map((page) => (
        <li key={page}>
          <Button asChild size='3' variant={current === page ? 'solid' : 'soft'}>
            {current === page ? (
              <span>{page}</span>
            ) : (
              <NavigatableLink data-sn-enabled to={`?page=${page}`}>
                {page}
              </NavigatableLink>
            )}
          </Button>
        </li>
      ))}
    </ul>
  )
}
