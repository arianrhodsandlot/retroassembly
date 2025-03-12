import { Button } from '@radix-ui/themes'
import { range } from 'es-toolkit'
import { Link } from 'waku'
import type { RomsPagination } from '@/controllers/get-roms'

export function GameListPagination({ pagination }: { pagination: RomsPagination }) {
  const { current, pages } = pagination

  if (pages <= 1) {
    return
  }

  return (
    <ul className='mt-8 flex flex-wrap justify-center gap-2 px-10'>
      {range(1, pages + 1).map((page) => (
        <li key={page}>
          <Button asChild size='3' variant={current === page ? 'solid' : 'soft'}>
            {current === page ? (
              <span>{page}</span>
            ) : (
              <Link key={page} to={`?page=${page}`}>
                {page}
              </Link>
            )}
          </Button>
        </li>
      ))}
    </ul>
  )
}
