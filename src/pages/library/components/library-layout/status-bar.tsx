import { Kbd } from '@radix-ui/themes'
import { capitalize, uniq } from 'es-toolkit'
import { useGamepads } from '../../hooks/use-gamepads.ts'
import { useInputMapping } from '../../hooks/use-input-mapping.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { SidebarFooter } from './sidebar-footer.tsx'

export function StatusBar() {
  const { connected } = useGamepads()
  const { keyboard: keyboardMapping } = useInputMapping()
  const { preference } = usePreference()

  return (
    <div className='flex items-center justify-end gap-4 text-sm font-medium text-white/80'>
      {connected ? (
        <>
          <span className='flex items-center gap-2'>
            <span className='icon-[mdi--microsoft-xbox-gamepad] text-white' />
            Connected
          </span>
          <span className='flex items-center gap-2'>
            <span className='icon-[mdi--gamepad] text-white' />
            Navigation
          </span>
          <span className='flex items-center gap-2'>
            <span className='icon-[mdi--gamepad-circle-right] text-white' />
            Confirm
          </span>
          <span className='flex items-center gap-2'>
            <span className='icon-[mdi--gamepad-circle-down] text-white' />
            Cancel
          </span>
        </>
      ) : (
        <>
          <span className='flex items-center gap-2'>
            <Kbd className='!text-[var(--accent-9)]' size='1'>
              {[
                keyboardMapping.input_player1_up,
                keyboardMapping.input_player1_down,
                keyboardMapping.input_player1_left,
                keyboardMapping.input_player1_right,
              ]
                .filter(Boolean)
                .map((key) => capitalize(key))
                .join(' ')}
            </Kbd>
            Navigation
          </span>

          {keyboardMapping.input_player1_a ? (
            <span className='flex items-center gap-2'>
              <Kbd className='!text-[var(--accent-9)]' size='1'>
                {uniq(['Enter', capitalize(keyboardMapping.input_player1_a)]).join(' / ')}
              </Kbd>
              Confirm
            </span>
          ) : null}

          {keyboardMapping.input_player1_b ? (
            <span className='flex items-center gap-2'>
              <Kbd className='!text-[var(--accent-9)]' size='1'>
                {uniq(['Esc', capitalize(keyboardMapping.input_player1_b)]).join(' / ')}
              </Kbd>
              Cancel
            </span>
          ) : null}
        </>
      )}

      {preference.ui.showSidebar ? null : <SidebarFooter />}
    </div>
  )
}
