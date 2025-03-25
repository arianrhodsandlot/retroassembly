import { Button, TextField } from '@radix-ui/themes'
import { clsx } from 'clsx'
import type { ChangeEvent, KeyboardEvent, ReactNode } from 'react'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { getKeyNameFromCode } from '@/pages/library/utils/keyboard.ts'

function handleChange(event: ChangeEvent<HTMLInputElement>) {
  event.preventDefault()
}

interface KeyboardInputProps {
  button: {
    iconClass?: string
    iconNode?: ReactNode
    name: string
    text?: string
  }
}

export function KeyboardInput({ button }: KeyboardInputProps) {
  const { isLoading, preference, update } = usePreference()
  const { keyboardMapping } = preference.emulator

  const value = keyboardMapping[button.name]
  const clearable = Boolean(value)

  async function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    event.preventDefault()
    const keyName = getKeyNameFromCode(event.code)
    if (keyName) {
      const newMapping = { ...keyboardMapping, [button.name]: keyName }
      const conflicts = Object.entries(keyboardMapping).filter(
        ([key, value]) => value === keyName && key !== button.name,
      )
      for (const [conflict] of conflicts) {
        newMapping[conflict] = null
      }
      await update({ emulator: { keyboardMapping: newMapping } })
    }
  }

  async function handleClickClear() {
    await update({ emulator: { keyboardMapping: { ...keyboardMapping, [button.name]: null } } })
  }

  return (
    <label className='flex items-center gap-2'>
      <div className='flex w-14 justify-end text-xs font-semibold text-black/70'>
        {button.iconClass ? <span className={clsx('size-7', button.iconClass)} /> : button.iconNode}
      </div>
      <div>
        <TextField.Root
          className='w-28'
          onChange={handleChange}
          onFocus={(event) => event.target.select()}
          onKeyDown={handleKeyDown}
          readOnly={isLoading}
          size='2'
          value={value ?? ''}
        >
          <TextField.Slot />
          <TextField.Slot>
            {clearable ? (
              <Button className='!-translate-x-1' onClick={handleClickClear} size='1' variant='ghost'>
                <span className='icon-[mdi--close]' />
              </Button>
            ) : null}
          </TextField.Slot>
        </TextField.Root>
        {button.text ? <span className='absolute ml-2 mt-0.5 text-xs opacity-50'>{button.text}</span> : null}
      </div>
    </label>
  )
}
