'use client'
import { Button, TextField } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { isNil } from 'es-toolkit'
import { type ReactNode, useEffect, useMemo, useRef } from 'react'
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

const defaultGamepadMapping = {
  $fast_forward: 'select+r2', // R2
  $pause: 'l1+r1',
  $rewind: 'select+l2', // L2
  input_enable_hotkey_btn: '8', // select
  input_player1_a_btn: '1',
  input_player1_b_btn: '0',
  input_player1_down_btn: '13',
  input_player1_l1_btn: '4',
  input_player1_l2_btn: '6',
  input_player1_l3_btn: '10',
  input_player1_left_btn: '14',
  input_player1_r1_btn: '5',
  input_player1_r2_btn: '7',
  input_player1_r3_btn: '11',
  input_player1_right_btn: '15',
  input_player1_select_btn: '8',
  input_player1_start_btn: '9',
  input_player1_up_btn: '12',
  input_player1_x_btn: '3',
  input_player1_y_btn: '2',
}

export function GamepadInput({ button }: GamepadInputProps) {
  const { gamepad } = useGamepads()
  if (!gamepad?.id) {
    throw new Error('this should not happen')
  }
  const { isLoading, preference, update } = usePreference()
  const textField = useRef(null)
  const userGamepadMapping = preference.emulator.gamepadMappings[gamepad?.id]
  const gamepadMapping = useMemo(() => userGamepadMapping || { ...defaultGamepadMapping }, [userGamepadMapping])

  const value = gamepadMapping[button.name]
  const readOnly = button.name.startsWith('$')
  const resetable = !readOnly && !isNil(value)

  async function handleClickClear() {
    if (gamepad?.id) {
      await update({
        emulator: {
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

  useEffect(() => {
    async function handlePress(event) {
      if (textField.current !== document.activeElement || isLoading) {
        return
      }
      const newMapping = {
        ...gamepadMapping,
        [button.name]: `${event.button}`,
      }
      const conflicts = Object.entries(gamepadMapping).filter(
        ([key, code]) => code === `${event.button}` && key !== button.name,
      )
      for (const [conflict] of conflicts) {
        newMapping[conflict] = null
      }
      await update({ emulator: { gamepadMappings: { [event.gamepad.id]: newMapping } } })
    }
    Gamepad.onPress(handlePress)

    return () => {
      Gamepad.offPress(handlePress)
    }
  }, [update, gamepadMapping, isLoading, button.name])

  return (
    <label className='flex items-center gap-2'>
      <div className='flex w-14 justify-end text-xs font-semibold text-black/70'>
        {button.iconClass ? <span className={clsx('size-7', button.iconClass)} /> : button.iconNode}
      </div>
      <div>
        <TextField.Root
          className='w-24'
          disabled={isLoading}
          onBeforeInput={(e) => e.preventDefault()}
          onChange={(e) => e.preventDefault()}
          onKeyDown={(e) => e.preventDefault()}
          readOnly={readOnly}
          ref={textField}
          size='2'
          value={value ?? ''}
        >
          <TextField.Slot />
          <TextField.Slot>
            {resetable ? (
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
