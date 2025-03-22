import { useMemo } from 'react'
import { useGamepads } from './use-gamepads.ts'
import { usePreference } from './use-preference.ts'

const defaultGamepadMapping = {
  $fast_forward: 'Select + R2', // R2
  $pause: 'L1 + R1',
  $rewind: 'Select + L2', // L2
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

export function useGamepadMapping() {
  const { preference } = usePreference()
  const { gamepad } = useGamepads()
  const userGamepadMapping = gamepad?.id ? preference.emulator.gamepadMappings[gamepad.id] : null
  const gamepadMapping = useMemo(() => userGamepadMapping || { ...defaultGamepadMapping }, [userGamepadMapping])
  return gamepadMapping
}
