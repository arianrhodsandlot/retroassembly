import { Button, TextField } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { type ReactNode, useEffect, useRef } from 'react'
import { useGamepadMapping } from '@/pages/library/hooks/use-gamepad-mapping.ts'
import { useGamepads } from '@/pages/library/hooks/use-gamepads.ts'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { Gamepad } from '@/utils/gamepad.ts'

interface GamepadInputProps {
  button: {
    iconClass?: string
    iconNode?: ReactNode
    name: string
    text?: string
  }
}

export function GamepadInput({ button }: Readonly<GamepadInputProps>) {
  const { gamepad } = useGamepads()
  if (!gamepad?.id) {
    throw new Error('this should not happen')
  }
  const { isLoading, update } = usePreference()
  const textField = useRef(null)
  const gamepadMapping = useGamepadMapping()

  const value = gamepadMapping[button.name]
  const disabled = button.name.startsWith('$')
  const clearable = !disabled && Boolean(value)

  async function handleClickClear() {
    if (gamepad?.id) {
      await update({
        input: {
          gamepadMappings: {
            [gamepad.id]: {
              ...gamepadMapping,
              [button.name]: null,
            },
          },
        },
      })
    }
  }

  useEffect(
    () =>
      Gamepad.onPressed(async (event) => {
        if (textField.current !== document.activeElement || isLoading) {
          return
        }
        const newMapping = { ...gamepadMapping, [button.name]: `${event.button}` }
        const conflicts = Object.entries(gamepadMapping).filter(
          ([key, code]) => code === `${event.button}` && key !== button.name,
        )
        for (const [conflict] of conflicts) {
          newMapping[conflict] = null
        }
        await update({ input: { gamepadMappings: { [event.gamepad.id]: newMapping } } })
      }),
    [update, gamepadMapping, isLoading, button.name],
  )

  return (
    <label className='flex items-center gap-2'>
      <div className='text-(--color-text)/70 flex w-14 justify-end text-xs font-semibold'>
        {button.iconClass ? <span className={clsx('size-7', button.iconClass)} /> : button.iconNode}
      </div>
      <div>
        <TextField.Root
          className='w-28'
          disabled={disabled}
          onBeforeInput={(event) => event.preventDefault()}
          onChange={(event) => event.preventDefault()}
          onFocus={(event) => event.target.select()}
          onKeyDown={(event) => event.preventDefault()}
          readOnly={isLoading}
          ref={textField}
          size='2'
          value={value ?? ''}
        >
          <TextField.Slot />
          <TextField.Slot>
            {clearable ? (
              <Button className='!-translate-x-1' onClick={handleClickClear} size='1' title='Clear' variant='ghost'>
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
