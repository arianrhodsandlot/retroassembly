import clsx from 'clsx'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useEmulatorLaunched } from '@/pages/library/atoms.ts'
import { useGamepads } from '@/pages/library/hooks/use-gamepads.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'
import { VirtualGamepadButton } from './virtual-gamepad-button.tsx'

const dpadButtons = [
  { buttonNames: ['up', 'left'], icon: 'icon-[mdi--arrow-up-left-thick]' },
  { buttonNames: ['up'], icon: 'icon-[mdi--arrow-up-thick]' },
  { buttonNames: ['right', 'up'], icon: 'icon-[mdi--arrow-top-right-thick]' },
  { buttonNames: ['left'], icon: 'icon-[mdi--arrow-left-thick]' },
  { buttonNames: [], icon: '' },
  { buttonNames: ['right'], icon: 'icon-[mdi--arrow-right-thick]' },
  { buttonNames: ['left', 'down'], icon: 'icon-[mdi--arrow-bottom-left-thick]' },
  { buttonNames: ['down'], icon: 'icon-[mdi--arrow-bottom-thick]' },
  { buttonNames: ['right', 'down'], icon: 'icon-[mdi--arrow-bottom-right-thick]' },
]

export function GameOverlayVirtualGamepad() {
  const { connected } = useGamepads()
  const [show, setShow] = useState(!connected)
  const { toggle } = useGameOverlay()
  const [launched] = useEmulatorLaunched()

  if (!launched) {
    return
  }

  return (
    <div className='fixed inset-0 block lg:hidden'>
      <div className='absolute inset-x-4 top-4 flex'>
        <VirtualGamepadButton
          className={twMerge('absolute left-0 rounded p-2', clsx({ hidden: !show }))}
          onClick={() => toggle()}
        >
          <span className='icon-[mdi--pause]' />
        </VirtualGamepadButton>

        <VirtualGamepadButton
          className='absolute right-0 rounded p-2'
          onClick={() => setShow(!show)}
          title='Toggle gamepad'
        >
          <span className='icon-[mdi--gamepad-square]' />
        </VirtualGamepadButton>
      </div>

      <div className={twMerge('absolute bottom-4 left-4 flex flex-col gap-2', clsx({ hidden: !show }))}>
        <div className='flex w-full gap-2'>
          <VirtualGamepadButton buttonName='l' className='flex-1 rounded px-2 py-1 ring ring-white/20'>
            L1
          </VirtualGamepadButton>
          <VirtualGamepadButton buttonName='l2' className='flex-1 rounded px-2 py-1 ring ring-white/20'>
            L2
          </VirtualGamepadButton>
        </div>
        <div className='grid grid-cols-3 overflow-hidden rounded-xl ring ring-white/20 *:size-14'>
          {dpadButtons.map(({ buttonNames, icon }) =>
            buttonNames.length > 0 ? (
              <VirtualGamepadButton buttonNames={buttonNames} key={buttonNames.join(',')} title={buttonNames.join(',')}>
                <span className={icon} />
              </VirtualGamepadButton>
            ) : (
              <div className='bg-black/20' key={buttonNames.join('')} />
            ),
          )}
        </div>
        <VirtualGamepadButton buttonName='select' className='rounded py-1 text-xs ring ring-white/20'>
          <span className='icon-[mdi--menu]' />
          Select
        </VirtualGamepadButton>
      </div>

      <div className={twMerge('absolute bottom-4 right-4 flex flex-col gap-2', clsx({ hidden: !show }))}>
        <div className='flex w-full gap-2'>
          <VirtualGamepadButton buttonName='r2' className='flex-1 rounded px-2 py-1 ring ring-white/20'>
            R2
          </VirtualGamepadButton>
          <VirtualGamepadButton buttonName='r' className='flex-1 rounded px-2 py-1 ring ring-white/20'>
            R1
          </VirtualGamepadButton>
        </div>
        <div className='grid grid-cols-3 grid-rows-3 *:size-14 *:rounded-full'>
          <VirtualGamepadButton buttonName='x' className='col-start-2 row-start-1 ring ring-white/20'>
            X
          </VirtualGamepadButton>
          <VirtualGamepadButton buttonName='y' className='col-start-1 row-start-2 ring ring-white/20'>
            Y
          </VirtualGamepadButton>
          <VirtualGamepadButton buttonName='a' className='col-start-3 row-start-2 ring ring-white/20'>
            A
          </VirtualGamepadButton>
          <VirtualGamepadButton buttonName='b' className='col-start-2 row-start-3 ring ring-white/20'>
            B
          </VirtualGamepadButton>
        </div>
        <VirtualGamepadButton buttonName='start' className='rounded py-1 text-xs ring ring-white/20'>
          <span className='icon-[mdi--play]' /> Start
        </VirtualGamepadButton>
      </div>
    </div>
  )
}
