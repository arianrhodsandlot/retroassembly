import { Button, Card } from '@radix-ui/themes'
import { defaultPreference } from '@/constants/preference.ts'
import { usePreference } from '../hooks/use-preference.ts'
import { KeyboardInput } from './keyboard-input.tsx'

const buttonGroups = [
  {
    buttons: [
      { iconClass: 'icon-[mdi--gamepad-up]', name: 'up' },
      { iconClass: 'icon-[mdi--gamepad-down]', name: 'down' },
      { iconClass: 'icon-[mdi--gamepad-left]', name: 'left' },
      { iconClass: 'icon-[mdi--gamepad-right]', name: 'right' },
    ],
    type: 'dpad',
  },
  {
    buttons: [
      { iconClass: 'icon-[mdi--gamepad-circle-left]', name: 'y' },
      { iconClass: 'icon-[mdi--gamepad-circle-up]', name: 'x' },
      { iconClass: 'icon-[mdi--gamepad-circle-down]', name: 'b' },
      { iconClass: 'icon-[mdi--gamepad-circle-right]', name: 'a' },
    ],
    type: 'actions',
  },
  {
    buttons: [
      { iconNode: <div className='rounded rounded-r-2xl border-2 border-current px-1'>Start</div>, name: 'start' },
      { iconNode: <div className='rounded border-2 border-current px-1'>Select</div>, name: 'select' },
    ],
    type: 'functions',
  },
  {
    buttons: [
      { iconNode: <div className='rounded rounded-bl-xl border-2 border-current px-2'>L1</div>, name: 'l1' },
      { iconNode: <div className='rounded rounded-tl-xl border-2 border-current px-2'>L2</div>, name: 'l2' },
      {
        iconNode: (
          <div className='inline-flex size-7 items-center justify-center rounded-full border-2 border-current'>L3</div>
        ),
        name: 'l3',
      },
    ],
    type: 'l',
  },
  {
    buttons: [
      { iconNode: <div className='rounded rounded-br-xl border-2 border-current px-2'>R1</div>, name: 'r1' },
      { iconNode: <div className='rounded rounded-tr-xl border-2 border-current px-2'>R2</div>, name: 'r2' },
      {
        iconNode: (
          <div className='inline-flex size-7 items-center justify-center rounded-full border-2 border-current'>R3</div>
        ),
        name: 'r3',
      },
    ],
    type: 'r',
  },
  {
    buttons: [
      { iconClass: 'icon-[mdi--pause]', name: 'pause', text: 'Pause' },
      { iconClass: 'icon-[mdi--rewind]', name: 'rewind', text: 'Rewind' },
      { iconClass: 'icon-[mdi--fast-forward]', name: 'fastforward', text: 'Fast forward' },
    ],
    type: 'time',
  },
]

export function KeyboardInputs() {
  const { isLoading, update } = usePreference()

  async function handleClickReset() {
    await update({ emulator: { keyboardMapping: defaultPreference.emulator.keyboardMapping } })
  }

  return (
    <div>
      <div className='flex items-center gap-2 py-2 text-lg font-semibold'>
        <h3 className='flex items-center gap-2'>
          <span className='icon-[mdi--keyboard]' /> Keyboard Inputs
        </h3>
      </div>

      <Card>
        <div className='flex flex-col gap-4 p-4'>
          {buttonGroups.map(({ buttons, type }) => (
            <div className='flex gap-4' key={type}>
              {buttons.map((button) => (
                <KeyboardInput button={button} key={button.name} />
              ))}
            </div>
          ))}

          <div className='flex justify-end'>
            <Button disabled={isLoading} onClick={handleClickReset} size='2' variant='soft'>
              <span className='icon-[mdi--undo]' />
              Reset to defaults
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
