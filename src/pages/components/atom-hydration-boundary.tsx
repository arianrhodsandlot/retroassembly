import { Provider, type SetStateAction, type WritableAtom } from 'jotai'
import { HydrationBoundary } from 'jotai-ssr'

interface HydrationBoundariesProps extends React.PropsWithChildren {
  hydrateAtoms: {
    atom: WritableAtom<unknown, SetStateAction<any>[], unknown>
    enableRehydrate: boolean
    value: unknown
  }[]
}

export function AtomHydrationBoundary({ children, hydrateAtoms }: HydrationBoundariesProps) {
  return (
    <Provider>
      <HydrationBoundary
        hydrateAtoms={hydrateAtoms.map(({ atom, value }) => [atom, value])}
        options={{ enableReHydrate: true }}
      >
        {children}
      </HydrationBoundary>
    </Provider>
  )
}
