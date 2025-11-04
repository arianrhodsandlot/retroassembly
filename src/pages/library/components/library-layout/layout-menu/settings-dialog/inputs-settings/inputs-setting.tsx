import { SegmentedControl } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useState, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { ConfirmButtonSettings } from './confirm-button-settings.tsx'
import { GamepadInputs } from './gamepad-inputs.tsx'
import { KeyboardInputs } from './keyboard-inputs.tsx'

export function InputsSettings() {
  const { t } = useTranslation()
  const [current, setCurrent] = useState('keyboard')
  const [currentContent, setCurrentContent] = useState('keyboard')

  const [isPending, startTransition] = useTransition()

  function handleTabChange(value: string) {
    setCurrent(value)
    startTransition(() => {
      setCurrentContent(value)
    })
  }

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <SegmentedControl.Root onValueChange={handleTabChange} value={current}>
          <SegmentedControl.Item value='keyboard'>
            <div className='flex items-center gap-2'>
              <span className='icon-[mdi--keyboard]' /> {t('Keyboard')}
            </div>
          </SegmentedControl.Item>
          <SegmentedControl.Item value='gamepad'>
            <div className='flex items-center gap-2'>
              <span className='icon-[mdi--gamepad]' /> {t('Gamepad')}
            </div>
          </SegmentedControl.Item>
        </SegmentedControl.Root>

        <div className={clsx('mt-2', { 'opacity-80': isPending })}>
          {currentContent === 'keyboard' ? <KeyboardInputs /> : null}
          {currentContent === 'gamepad' ? <GamepadInputs /> : null}
        </div>
      </div>

      <ConfirmButtonSettings />
    </div>
  )
}
