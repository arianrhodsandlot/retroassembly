import { SearchResultItem } from './search-result-item.tsx'

interface SearchResultsProps {
  keyword: string
  loading: boolean
  results?: any
}

export function SearchResults({ keyword, loading, results }: Readonly<SearchResultsProps>) {
  if (results?.length) {
    return (
      <ul>
        {results?.slice(0, 10).map((rom) => (
          <SearchResultItem key={rom.id} keyword={keyword} rom={rom} />
        ))}
      </ul>
    )
  }

  if (!loading && !results?.length) {
    return (
      <div className='flex w-full items-center justify-center gap-2 py-4 text-lg opacity-60'>
        <span className='icon-[mdi--magnify-remove-outline] text-xl' />
        No results found
      </div>
    )
  }
}
