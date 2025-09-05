import { SearchResultItem } from './search-result-item.tsx'

export function SearchResults({
  searchResults,
}: Readonly<{
  searchResults?: any
}>) {
  return searchResults?.roms.map((rom) => <SearchResultItem key={rom.id} rom={rom} />)
}
