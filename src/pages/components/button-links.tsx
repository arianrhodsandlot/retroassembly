import { Button } from '@radix-ui/themes'
import { Link } from 'react-router'

export function ButtonLinks() {
  return (
    <div className='mt-8 flex flex-col justify-center gap-4 lg:flex-row lg:*:!w-48'>
      <Button asChild radius='small' size='4' type='button'>
        <Link reloadDocument to='/demo'>
          <span className='icon-[mdi--presentation-play]' />
          Live demo
        </Link>
      </Button>

      <Button asChild radius='small' size='4' type='button' variant='outline'>
        <Link
          className='!bg-(--color-background) [.dark_&]:!border-(--gray-4) !border-2 !shadow-none'
          reloadDocument
          to='/library'
        >
          <span className='icon-[mdi--bookshelf]' />
          Library
        </Link>
      </Button>
    </div>
  )
}
