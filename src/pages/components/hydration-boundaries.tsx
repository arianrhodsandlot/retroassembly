import { groupBy } from 'es-toolkit'
import type { SetStateAction, WritableAtom } from 'jotai'
import { HydrationBoundary } from 'jotai-ssr'

interface HydrationBoundariesProps extends React.PropsWithChildren {
  hydrateAtoms: {
    atom: WritableAtom<unknown, SetStateAction<any>[], unknown>
    enableRehydrate: boolean
    value: unknown
  }[]
}

export function HydrationBoundaries({ children, hydrateAtoms }: HydrationBoundariesProps) {
  const groupedAtoms = groupBy(hydrateAtoms, ({ enableRehydrate }) => `${enableRehydrate}`)
  return (
    <HydrationBoundary
      hydrateAtoms={groupedAtoms.true.map(({ atom, value }) => [atom, value])}
      options={{ enableReHydrate: true }}
    >
      <HydrationBoundary
        hydrateAtoms={groupedAtoms.false.map(({ atom, value }) => [atom, value])}
        options={{ enableReHydrate: false }}
      >
        {children}
      </HydrationBoundary>
    </HydrationBoundary>
  )
}
