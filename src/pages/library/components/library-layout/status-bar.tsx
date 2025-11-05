import { Kbd } from '@radix-ui/themes'
import { capitalize, uniq } from 'es-toolkit'
import { useTranslation } from 'react-i18next'
import { useGamepads } from '../../hooks/use-gamepads.ts'
import { useInputMapping } from '../../hooks/use-input-mapping.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { LayoutMenu } from './layout-menu/layout-menu.tsx'

const rightButtonIcon = <span className='icon-[mdi--gamepad-circle-right] text-white' />
const downButtonIcon = <span className='icon-[mdi--gamepad-circle-down] text-white' />

export function StatusBar() {
  const { t } = useTranslation()
  const { connected } = useGamepads()
  const { keyboard: keyboardMapping } = useInputMapping()
  const { preference } = usePreference()

  const { confirmButtonStyle } = preference.input
  const keyboarMappingConfirm = { nintendo: keyboardMapping.input_player1_a, xbox: keyboardMapping.input_player1_b }[
    confirmButtonStyle
  ]
  const keyboarMappingCancel = { nintendo: keyboardMapping.input_player1_b, xbox: keyboardMapping.input_player1_a }[
    confirmButtonStyle
  ]

  return (
    <div className='hidden items-center justify-end gap-4 text-sm font-medium text-white/80 lg:flex'>
      {connected ? (
        <>
          <span className='flex items-center gap-2'>
            <span className='icon-[mdi--microsoft-xbox-gamepad] text-white' />
            {t('Connected')}
          </span>
          <span className='flex items-center gap-2'>
            <span className='icon-[mdi--gamepad] text-white' />
            {t('Move')}
          </span>
          <span className='flex items-center gap-2'>
            {{ nintendo: rightButtonIcon, xbox: downButtonIcon }[confirmButtonStyle]}
            {t('Confirm')}
          </span>
          <span className='flex items-center gap-2'>
            {{ nintendo: downButtonIcon, xbox: rightButtonIcon }[confirmButtonStyle]}
            {t('Back')}
          </span>
        </>
      ) : (
        <>
          <span className='flex items-center gap-2'>
            <Kbd className='text-(--accent-9)!' size='1'>
              {[
                keyboardMapping.input_player1_up,
                keyboardMapping.input_player1_down,
                keyboardMapping.input_player1_left,
                keyboardMapping.input_player1_right,
              ]
                .filter(Boolean)
                .map((key) => ({ down: '↓', left: '←', right: '→', up: '↑' })[key] || capitalize(key))
                .join(' ')}
            </Kbd>
            {t('Move')}
          </span>

          {keyboarMappingConfirm ? (
            <span className='flex items-center gap-2'>
              <Kbd className='text-(--accent-9)!' size='1'>
                {uniq(['Enter', capitalize(keyboarMappingConfirm)]).join(' / ')}
              </Kbd>
              {t('Confirm')}
            </span>
          ) : null}

          {keyboarMappingCancel ? (
            <span className='flex items-center gap-2'>
              <Kbd className='text-(--accent-9)!' size='1'>
                {capitalize(keyboarMappingCancel)}
              </Kbd>
              {t('Back')}
            </span>
          ) : null}
        </>
      )}

      {preference.ui.showSidebar ? null : <LayoutMenu />}
    </div>
  )
}
