import { pull } from 'es-toolkit'
import * as gamepadjs from 'gamepad.js'

interface GamepadButtonEvent {
  button: number
  gamepad: Gamepad
  index: number
  pressed: boolean
  value: number
}

export const Gamepad = {
  callbacksMap: {},
  initialized: false,

  handlePress(event) {
    const { index, pressed } = event.detail
    if (!pressed || index) {
      return
    }
    const eventName = 'press'
    const callbacks = Gamepad.callbacksMap[eventName]
    if (callbacks) {
      for (const callback of callbacks) {
        callback(event.detail)
      }
    }
  },
  initialize() {
    if (typeof globalThis.navigator?.getGamepads !== 'function') {
      return
    }
    if (Gamepad.initialized) {
      return
    }
    const GamepadListener = gamepadjs.GamepadListener || gamepadjs.default.GamepadListener
    const listener = new GamepadListener({ button: { analog: false } })
    listener.start()
    Gamepad.initialized = true
    listener.on('gamepad:button', Gamepad.handlePress)
  },
  offPress(callback: unknown) {
    const eventName = 'press'
    const callbacks = Gamepad.callbacksMap[eventName]
    if (callbacks) {
      pull(callbacks, [callback])
    }
  },
  onPress(callback: (event: GamepadButtonEvent) => void) {
    const eventName = 'press'
    Gamepad.callbacksMap[eventName] ??= []
    Gamepad.callbacksMap[eventName].push(callback)
    this.initialize()
    return () => {
      Gamepad.offPress(callback)
    }
  },
}
