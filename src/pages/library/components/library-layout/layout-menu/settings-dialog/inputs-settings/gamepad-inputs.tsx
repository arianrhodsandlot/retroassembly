import { Callout, Card } from '@radix-ui/themes'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { ResolvedPreference } from '#@/constants/preference.ts'
import { useGamepads } from '#@/pages/library/hooks/use-gamepads.ts'
import { SettingsTitle } from '../settings-title.tsx'
import { UpdateButton } from '../update-button.tsx'
import { GamepadInput } from './gamepad-input.tsx'
import { GamepadTitle } from './gamepad-title.tsx'

interface ButtonGroup {
  buttons: {
    iconClass?: string
    iconNode?: ReactNode
    name: keyof ResolvedPreference['input']['gamepadMappings'][string]
    text?: string
  }[]
  type: string
}

export function GamepadInputs() {
  const { t } = useTranslation()
  const { connected, gamepad } = useGamepads()

  const buttonGroups: ButtonGroup[] = [
    {
      buttons: [
        { iconClass: 'icon-[mdi--gamepad-up]', name: 'input_player1_up_btn' },
        { iconClass: 'icon-[mdi--gamepad-down]', name: 'input_player1_down_btn' },
        { iconClass: 'icon-[mdi--gamepad-left]', name: 'input_player1_left_btn' },
        { iconClass: 'icon-[mdi--gamepad-right]', name: 'input_player1_right_btn' },
      ],
      type: 'dpad',
    },
    {
      buttons: [
        { iconClass: 'icon-[mdi--gamepad-circle-left]', name: 'input_player1_y_btn' },
        { iconClass: 'icon-[mdi--gamepad-circle-up]', name: 'input_player1_x_btn' },
        { iconClass: 'icon-[mdi--gamepad-circle-down]', name: 'input_player1_b_btn' },
        { iconClass: 'icon-[mdi--gamepad-circle-right]', name: 'input_player1_a_btn' },
      ],
      type: 'actions',
    },
    {
      buttons: [
        {
          iconNode: <div className='rounded border-2 border-current px-1'>Select</div>,
          name: 'input_player1_select_btn',
        },
        {
          iconNode: <div className='rounded rounded-r-2xl border-2 border-current px-1'>Start</div>,
          name: 'input_player1_start_btn',
        },
      ],
      type: 'functions',
    },
    {
      buttons: [
        {
          iconNode: <div className='rounded rounded-bl-xl border-2 border-current px-2'>L1</div>,
          name: 'input_player1_l1_btn',
        },
        {
          iconNode: <div className='rounded rounded-tl-xl border-2 border-current px-2'>L2</div>,
          name: 'input_player1_l2_btn',
        },
        {
          iconNode: (
            <div className='inline-flex size-7 items-center justify-center rounded-full border-2 border-current'>
              L3
            </div>
          ),
          name: 'input_player1_l3_btn',
        },
      ],
      type: 'l',
    },
    {
      buttons: [
        {
          iconNode: <div className='rounded rounded-br-xl border-2 border-current px-2'>R1</div>,
          name: 'input_player1_r1_btn',
        },
        {
          iconNode: <div className='rounded rounded-tr-xl border-2 border-current px-2'>R2</div>,
          name: 'input_player1_r2_btn',
        },
        {
          iconNode: (
            <div className='inline-flex size-7 items-center justify-center rounded-full border-2 border-current'>
              R3
            </div>
          ),
          name: 'input_player1_r3_btn',
        },
      ],
      type: 'r',
    },
    {
      buttons: [
        { iconClass: 'icon-[mdi--pause]', name: '$pause', text: t('Pause') },
        { iconClass: 'icon-[mdi--rewind]', name: '$rewind', text: t('Rewind') },
        { iconClass: 'icon-[mdi--fast-forward]', name: '$fast_forward', text: t('Fast forward') },
      ],
      type: 'time',
    },
  ]
  return (
    <>
      <Callout.Root size={'1'}>
        <Callout.Icon>
          <span className='icon-[mdi--information]' />
        </Callout.Icon>
        <Callout.Text>
          {t('You can visit')}{' '}
          <a
            className='inline-flex items-center gap-1 underline'
            href='https://hardwaretester.com/gamepad'
            rel='noreferrer noopener'
            target='_blank'
          >
            {t('Gamepad Tester')}
            <span className='icon-[mdi--open-in-new]' />
          </a>{' '}
          {t('to test your gamepad and see the button names.')}
        </Callout.Text>
      </Callout.Root>

      <Card className='mt-2'>
        {gamepad?.id ? (
          <SettingsTitle>
            <span className='icon-[mdi--google-gamepad]' />
            <div className='flex items-baseline gap-2'>
              <GamepadTitle id={gamepad.id} />
            </div>
          </SettingsTitle>
        ) : null}

        {connected ? (
          <div className='flex flex-col gap-4 p-4'>
            {buttonGroups.map(({ buttons, type }) => (
              <div className='flex flex-col gap-4 lg:flex-row' key={type}>
                {buttons.map((button) => (
                  <GamepadInput button={button} key={button.name} />
                ))}
              </div>
            ))}

            <div className='flex justify-end'>
              <UpdateButton preference={{ input: { gamepadMappings: null } }}>
                <span className='icon-[mdi--undo]' />
                {t('Reset to defaults')}
              </UpdateButton>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-2 py-10 text-center opacity-50 lg:flex-row'>
            <span className='icon-[svg-spinners--180-ring] shrink-0 text-2xl' />
            <span className='lg:text-2xl'>{t('Press any key on your gamepad')}</span>
          </div>
        )}
      </Card>
    </>
  )
}
