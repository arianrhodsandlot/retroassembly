import { capitalize, compact } from 'es-toolkit'
import type { ReactNode } from 'react'
import { useGamepads } from '@/pages/library/hooks/use-gamepads.ts'
import { useInputMapping } from '@/pages/library/hooks/use-input-mapping.ts'
import { GameInputMessageItem } from './game-input-message-item.tsx'

export function GameInputMessage() {
  const { connected } = useGamepads()
  const { keyboard: keyboardMapping } = useInputMapping()

  const messages: { keyNames: string[]; message: ReactNode }[] = connected
    ? [
        { keyNames: ['L1', 'R1'], message: 'Pause' },
        { keyNames: ['Select', 'L2'], message: 'Rewind' },
        { keyNames: ['Select', 'R2'], message: 'Fast forward' },
      ]
    : [
        {
          keyNames: [
            compact([
              keyboardMapping.input_player1_up,
              keyboardMapping.input_player1_down,
              keyboardMapping.input_player1_left,
              keyboardMapping.input_player1_right,
            ])
              .map((key) => capitalize(key))
              .join(' '),
          ],
          message: <span className='icon-[mdi--gamepad]' />,
        },
        {
          keyNames: compact([keyboardMapping.input_player1_x]),
          message: <span className='icon-[mdi--gamepad-circle-up]' />,
        },
        {
          keyNames: compact([keyboardMapping.input_player1_y]),
          message: <span className='icon-[mdi--gamepad-circle-left]' />,
        },
        {
          keyNames: compact([keyboardMapping.input_player1_a]),
          message: <span className='icon-[mdi--gamepad-circle-right]' />,
        },
        {
          keyNames: compact([keyboardMapping.input_player1_b]),
          message: <span className='icon-[mdi--gamepad-circle-down]' />,
        },
        { keyNames: compact([keyboardMapping.$pause]), message: 'Pause' },
        { keyNames: compact([keyboardMapping.input_rewind]), message: 'Rewind' },
        { keyNames: compact([keyboardMapping.input_hold_fast_forward]), message: 'Fast forward' },
      ]

  return messages
    .filter(({ keyNames }) => keyNames.length)
    .map(({ keyNames, message }) => (
      <GameInputMessageItem key={keyNames.join(',')} keyNames={keyNames}>
        {message}
      </GameInputMessageItem>
    ))
}
