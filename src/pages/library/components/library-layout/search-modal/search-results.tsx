import { SearchResultItem } from './search-result-item.tsx'

interface SearchResultsProps {
  loading: boolean
  query: string
  results?: any
}

export function SearchResults({ loading, query, results }: Readonly<SearchResultsProps>) {
  if (results?.length) {
    return (
      <ul>
        {results?.map((rom) => (
          <SearchResultItem key={rom.id} query={query} rom={rom} />
        ))}
      </ul>
    )
  }

  if (!loading && query) {
    return (
      <div className='flex w-full items-center justify-center gap-2 py-4 text-lg opacity-60'>
        <span className='icon-[mdi--magnify-remove-outline] text-xl' />
        No results found
      </div>
    )
  }
}
