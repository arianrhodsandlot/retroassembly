import { pull } from 'es-toolkit'
import * as gamepadjs from 'gamepad.js'

interface GamepadButtonEvent {
  button: number
  gamepad: Gamepad
  index: number
  pressed: boolean
  value: number
}

type Timer = ReturnType<typeof setTimeout>

export const Gamepad = {
  callbacksMap: {} as Record<string, ((event: GamepadButtonEvent) => void)[]>,
  initialized: false,
  timers: {} as Record<number, Timer>,

  handleButton(event: { detail: GamepadButtonEvent }) {
    const { button, index, pressed } = event.detail
    if (index) {
      return
    }

    if (pressed) {
      Gamepad.trigger('press', event.detail)
      Gamepad.trigger('down', event.detail)
      Gamepad.startRepeat(button, event.detail)
    } else {
      Gamepad.stopRepeat(button)
      Gamepad.trigger('up', event.detail)
    }
  },

  trigger(eventName: string, detail: GamepadButtonEvent) {
    const callbacks = Gamepad.callbacksMap[eventName]
    if (callbacks) {
      for (const callback of callbacks) {
        callback(detail)
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
    listener.on('gamepad:button', Gamepad.handleButton.bind(Gamepad))
  },

  onButtonDown(callback: (event: GamepadButtonEvent) => void) {
    const eventName = 'down'
    Gamepad.callbacksMap[eventName] ??= []
    Gamepad.callbacksMap[eventName].push(callback)
    const callbacks = Gamepad.callbacksMap[eventName]
    this.initialize()
    return () => {
      pull(callbacks, [callback])
    }
  },

  onButtonUp(callback: (event: GamepadButtonEvent) => void) {
    const eventName = 'up'
    Gamepad.callbacksMap[eventName] ??= []
    Gamepad.callbacksMap[eventName].push(callback)
    const callbacks = Gamepad.callbacksMap[eventName]
    this.initialize()
    return () => {
      pull(callbacks, [callback])
    }
  },

  onPress(callback: (event: GamepadButtonEvent) => void) {
    const eventName = 'press'
    Gamepad.callbacksMap[eventName] ??= []
    Gamepad.callbacksMap[eventName].push(callback)
    const callbacks = Gamepad.callbacksMap[eventName]
    this.initialize()
    return () => {
      pull(callbacks, [callback])
    }
  },

  startRepeat(button: number, detail: GamepadButtonEvent) {
    Gamepad.stopRepeat(button)
    Gamepad.timers[button] = setTimeout(() => {
      Gamepad.timers[button] = setInterval(() => {
        Gamepad.trigger('down', detail)
      }, 100)
    }, 500)
  },

  stopRepeat(button: number) {
    if (Gamepad.timers[button]) {
      clearTimeout(Gamepad.timers[button])
      clearInterval(Gamepad.timers[button])
      delete Gamepad.timers[button]
    }
  },
}
