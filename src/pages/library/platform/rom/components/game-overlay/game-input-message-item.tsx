import { Kbd } from '@radix-ui/themes'
import { capitalize } from 'es-toolkit'
import { Fragment, type PropsWithChildren } from 'react'

interface GameInputMessageItemProps extends PropsWithChildren {
  keyNames?: string[]
}

export function GameInputMessageItem({ children, keyNames }: GameInputMessageItemProps) {
  return (
    <div className='flex items-center gap-2'>
      {keyNames?.map((keyName, i) => (
        <Fragment key={keyName}>
          <Kbd className='!text-(--accent-9)' size='1'>
            {capitalize(keyName)}
          </Kbd>
          {i < keyNames.length - 1 ? <>+</> : null}
        </Fragment>
      ))}

      {children}
    </div>
  )
}
