import * as gamepadjs from 'Gamepad.js'
import { pull } from 'es-toolkit'

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
  handlePressed(event) {
    const { index, pressed } = event.detail
    if (pressed || index) {
      return
    }
    const eventName = 'pressed'
    const callbacks = Gamepad.callbacksMap[eventName]
    if (callbacks) {
      for (const callback of callbacks) {
        callback(event.detail)
      }
    }
  },
  initialize() {
    if (Gamepad.initialized) {
      return
    }
    const GamepadListener = gamepadjs.GamepadListener || gamepadjs.default.GamepadListener
    const listener = new GamepadListener({ button: { analog: false } })
    listener.start()
    Gamepad.initialized = true
    listener.on('gamepad:button', Gamepad.handlePress)
    listener.on('gamepad:button', Gamepad.handlePressed)
  },
  offPress(callback: unknown) {
    const eventName = 'press'
    const callbacks = Gamepad.callbacksMap[eventName]
    if (callbacks) {
      pull(callbacks, [callback])
    }
  },
  offPressed(callback: unknown) {
    const eventName = 'pressed'
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
  onPressed(callback: (event: GamepadButtonEvent) => void) {
    const eventName = 'pressed'
    Gamepad.callbacksMap[eventName] ??= []
    Gamepad.callbacksMap[eventName].push(callback)
    this.initialize()
    return () => {
      Gamepad.offPressed(callback)
    }
  },
}
