import { SegmentedControl } from '@radix-ui/themes'
import clsx from 'clsx'
import { useState, useTransition } from 'react'
import { GamepadInputs } from './gamepad-inputs.tsx'
import { KeyboardInputs } from './keyboard-inputs.tsx'

export function InputsSettings() {
  const [current, setCurrent] = useState('keyboard')
  const [currentContent, setCurrentContent] = useState('keyboard')

  const [isPending, startTransition] = useTransition()

  function handleValueChange(value: string) {
    setCurrent(value)
    startTransition(() => {
      setCurrentContent(value)
    })
  }

  return (
    <>
      <SegmentedControl.Root onValueChange={handleValueChange} value={current}>
        <SegmentedControl.Item value='keyboard'>
          <div className='flex items-center gap-2'>
            <span className='icon-[mdi--keyboard]' /> Keyboard
          </div>
        </SegmentedControl.Item>
        <SegmentedControl.Item value='gamepad'>
          <div className='flex items-center gap-2'>
            <span className='icon-[mdi--gamepad]' /> Gamepad
          </div>
        </SegmentedControl.Item>
      </SegmentedControl.Root>

      <div className={clsx('mt-2', { 'opacity-80': isPending })}>
        {currentContent === 'keyboard' ? <KeyboardInputs /> : null}
        {currentContent === 'gamepad' ? <GamepadInputs /> : null}
      </div>
    </>
  )
}
