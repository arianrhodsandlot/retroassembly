import { Card } from '@radix-ui/themes'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Preference } from '@/constants/preference.ts'
import { UpdateButton } from '../update-button.tsx'
import { KeyboardInput } from './keyboard-input.tsx'

interface ButtonGroup {
  buttons: {
    iconClass?: string
    iconNode?: ReactNode
    name: keyof NonNullable<NonNullable<Preference['input']>['keyboardMapping']>
    text?: string
  }[]
  type: string
}

export function KeyboardInputs() {
  const { t } = useTranslation()

  const buttonGroups: ButtonGroup[] = [
    {
      buttons: [
        { iconClass: 'icon-[mdi--gamepad-up]', name: 'input_player1_up' },
        { iconClass: 'icon-[mdi--gamepad-down]', name: 'input_player1_down' },
        { iconClass: 'icon-[mdi--gamepad-left]', name: 'input_player1_left' },
        { iconClass: 'icon-[mdi--gamepad-right]', name: 'input_player1_right' },
      ],
      type: 'dpad',
    },
    {
      buttons: [
        { iconClass: 'icon-[mdi--gamepad-circle-left]', name: 'input_player1_y' },
        { iconClass: 'icon-[mdi--gamepad-circle-up]', name: 'input_player1_x' },
        { iconClass: 'icon-[mdi--gamepad-circle-down]', name: 'input_player1_b' },
        { iconClass: 'icon-[mdi--gamepad-circle-right]', name: 'input_player1_a' },
      ],
      type: 'actions',
    },
    {
      buttons: [
        { iconNode: <div className='rounded border-2 border-current px-1'>Select</div>, name: 'input_player1_select' },
        {
          iconNode: <div className='rounded rounded-r-2xl border-2 border-current px-1'>Start</div>,
          name: 'input_player1_start',
        },
      ],
      type: 'functions',
    },
    {
      buttons: [
        {
          iconNode: <div className='rounded rounded-bl-xl border-2 border-current px-2'>L1</div>,
          name: 'input_player1_l1',
        },
        {
          iconNode: <div className='rounded rounded-tl-xl border-2 border-current px-2'>L2</div>,
          name: 'input_player1_l2',
        },
        {
          iconNode: (
            <div className='inline-flex size-7 items-center justify-center rounded-full border-2 border-current'>L3</div>
          ),
          name: 'input_player1_l3',
        },
      ],
      type: 'l',
    },
    {
      buttons: [
        {
          iconNode: <div className='rounded rounded-br-xl border-2 border-current px-2'>R1</div>,
          name: 'input_player1_r1',
        },
        {
          iconNode: <div className='rounded rounded-tr-xl border-2 border-current px-2'>R2</div>,
          name: 'input_player1_r2',
        },
        {
          iconNode: (
            <div className='inline-flex size-7 items-center justify-center rounded-full border-2 border-current'>R3</div>
          ),
          name: 'input_player1_r3',
        },
      ],
      type: 'r',
    },
    {
      buttons: [
        { iconClass: 'icon-[mdi--pause]', name: '$pause', text: t('Pause') },
        { iconClass: 'icon-[mdi--rewind]', name: 'input_rewind', text: t('Rewind') },
        { iconClass: 'icon-[mdi--fast-forward]', name: 'input_hold_fast_forward', text: t('Fast forward') },
      ],
      type: 'time',
    },
  ]
  return (
    <Card>
      <div className='flex flex-col gap-4 p-4'>
        {buttonGroups.map(({ buttons, type }) => (
          <div className='flex flex-col gap-4 lg:flex-row' key={type}>
            {buttons.map((button) => (
              <KeyboardInput button={button} key={button.name} />
            ))}
          </div>
        ))}

        <div className='flex justify-end'>
          <UpdateButton preference={{ input: { keyboardMapping: null } }}>
            <span className='icon-[mdi--undo]' />
            {t('Reset to defaults')}
          </UpdateButton>
        </div>
      </div>
    </Card>
  )
}
