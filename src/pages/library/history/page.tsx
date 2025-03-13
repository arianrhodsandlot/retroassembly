import { getLaunchRecords } from '@/controllers/get-launch-records.ts'
import AppLayout from '../components/app-layout.tsx'
import { GameList } from '../components/game-list.tsx'

export async function HistoryPage({ query }: { query: string }) {
  const page = Number.parseInt(new URLSearchParams(query).get('page') || '', 10) || 1
  const { pagination, roms } = await getLaunchRecords({ page })

  if (page > 1 && roms.length === 0) {
    return '404'
  }

  return (
    <AppLayout>
      <title>Library - RetroAssembly</title>
      <div className='flex flex-col gap-5'>
        <div className='relative flex justify-between px-4 pt-4'>
          <h1 className='text-5xl font-[Oswald_Variable] font-semibold'>History</h1>
          <div className='mt-4 flex items-center gap-2 text-zinc-400'>
            <span className='icon-[mdi--bar-chart] text-black' />
            Played
            <span className='font-[DSEG7_Modern] font-bold text-rose-700'>{pagination.total}</span>
            games.
          </div>
        </div>
        <hr className='border-t-1 border-t-black/20' />
        <GameList pagination={pagination} roms={roms} />
      </div>
    </AppLayout>
  )
}
