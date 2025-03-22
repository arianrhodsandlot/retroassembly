import * as gamepadjs from 'Gamepad.js'
import { pull } from 'es-toolkit'

export const Gamepad = {
  callbacksMap: {},
  initialized: false,

  handleGamepadButton(event) {
    const { index, pressed } = event.detail
    if (pressed || index) {
      return
    }
    const eventName = 'press'
    const callbacks = Gamepad.callbacksMap[eventName]
    for (const callback of callbacks) {
      callback(event.detail)
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
    listener.on('gamepad:button', Gamepad.handleGamepadButton)
  },
  offPress(callback) {
    const eventName = 'press'
    const callbacks = Gamepad.callbacksMap[eventName]
    if (callbacks) {
      pull(callbacks, [callback])
    }
  },
  onPress(callback) {
    const eventName = 'press'
    Gamepad.callbacksMap[eventName] ??= []
    Gamepad.callbacksMap[eventName].push(callback)
    this.initialize()
  },
}
