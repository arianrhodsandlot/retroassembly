import { atom, useAtom } from 'jotai'

const showSearchModalAtom = atom(false)
export function useShowSearchModal() {
  return useAtom(showSearchModalAtom)
}
