import { Button, TextField } from '@radix-ui/themes'
import { clsx } from 'clsx'
import type { ChangeEvent, KeyboardEvent, ReactNode } from 'react'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'

function handleChange(event: ChangeEvent<HTMLInputElement>) {
  event.preventDefault()
}

/*
left, right, up, down, enter, kp_enter, tab, insert, del, end, home,
rshift, shift, ctrl, alt, space, escape, add, subtract, kp_plus, kp_minus,
f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12,
num0, num1, num2, num3, num4, num5, num6, num7, num8, num9, pageup, pagedown,
keypad0, keypad1, keypad2, keypad3, keypad4, keypad5, keypad6, keypad7, keypad8, keypad9,
period, capslock, numlock, backspace, multiply, divide, print_screen, scroll_lock,
tilde, backquote, pause, quote, comma, minus, slash, semicolon, equals, leftbracket,
backslash, rightbracket, kp_period, kp_equals, rctrl, ralt
*/
const knownKeyMap = {
  AltLeft: 'alt',
  AltRight: 'ralt',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  Backslash: 'backslash',
  Backspace: 'backspace',
  BracketLeft: 'leftbracket',
  BracketRight: 'rightbracket',
  CapsLock: 'capslock',
  Comma: 'comma',
  ControlLeft: 'ctrl',
  ControlRight: 'rctrl',
  Delete: 'del',
  End: 'end',
  Enter: 'enter',
  Equal: 'equals',
  Home: 'home',
  Insert: 'insert',
  Minus: 'minus',
  NumpadAdd: 'add',
  NumpadDivide: 'divide',
  NumpadEnter: 'kp_enter',
  NumpadMultiply: 'multiply',
  NumpadSubtract: 'subtract',
  PageDown: 'pagedown',
  PageUp: 'pageup',
  Period: 'period',
  Quote: 'quote',
  Semicolon: 'semicolon',
  ShiftLeft: 'shift',
  ShiftRight: 'rshift',
  Slash: 'slash',
  Space: 'space',
  Tab: 'tab',
}

function getKeyNameFromEvent(event: KeyboardEvent) {
  const { code } = event
  if (code in knownKeyMap) {
    return knownKeyMap[code]
  }
  if (code.startsWith('Key')) {
    return code.slice(3).toLowerCase()
  }
  if (code.startsWith('Digit')) {
    return `num${code.slice(5)}`
  }
  if (code.startsWith('F')) {
    return code.toLowerCase()
  }
  if (code.startsWith('Numpad')) {
    const keyName = code.slice(6).toLowerCase()
    if (/\d/.test(keyName)) {
      return `keypad${keyName}`
    }
  }
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
    const keyName = getKeyNameFromEvent(event)
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
          className='w-24'
          disabled={isLoading}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          size='1'
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
