import { useSyncExternalStore } from 'react'

function subscribe(callback) {
  globalThis.addEventListener('gamepadconnected', callback)
  globalThis.addEventListener('gamepaddisconnected', callback)
  return () => {
    globalThis.removeEventListener('gamepadconnected', callback)
    globalThis.removeEventListener('gamepaddisconnected', callback)
  }
}

const identities = ['id', 'index', 'connected']
function isSameGamepad(gamepad1, gamepad2) {
  if (gamepad1 === gamepad2 || (!gamepad1 && !gamepad2)) {
    return true
  }
  if (gamepad1 && gamepad2) {
    return identities.every((identity) => gamepad1[identity] === gamepad2[identity])
  }
  return false
}

function isSameGamepads(gamepads1, gamepads2) {
  if (gamepads1?.length !== gamepads2?.length) {
    return false
  }
  if (gamepads1 && gamepads2) {
    for (const [i, gamepad1] of gamepads1.entries()) {
      if (!isSameGamepad(gamepad1, gamepads2[i])) {
        return false
      }
    }
    return true
  }
  return false
}

let snapshot: (Gamepad | null)[]
function getSnapshot() {
  const gamepads = navigator.getGamepads?.()
  if (!isSameGamepads(gamepads, snapshot)) {
    snapshot = gamepads
  }
  return snapshot
}

export function useGamepads() {
  const gamepads = useSyncExternalStore(subscribe, getSnapshot, () => null)
  const gamepad = gamepads?.[0]
  const connected = Boolean(gamepad)
  return { connected, gamepad, gamepads }
}
