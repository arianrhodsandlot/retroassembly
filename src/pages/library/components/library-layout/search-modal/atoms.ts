import { atom, useAtom } from 'jotai'

const selectedResultAtom = atom<any>()
export function useSelectedResult() {
  return useAtom(selectedResultAtom)
}
