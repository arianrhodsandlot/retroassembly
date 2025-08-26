import { useLocation } from 'react-router'

export function useGameActions(rom) {
  const location = useLocation()
  const pageType = location.pathname === '/library/history' ? 'history' : 'library'

  const actionsMap = {
    history: [
      {
        api: `roms/${rom.id}/launch_records`,
        color: 'red',
        confirmDescription:
          'Are you sure to proceed?\nThe deleted history item cannot be restored.\nThe ROM related to this history item will NOT be deleted.',
        icon: 'icon-[mdi--delete]',
        name: 'delete',
        text: 'Delete from history',
      },
    ],
    library: [
      {
        api: `roms/${rom.id}`,
        color: 'red',
        confirmDescription: 'Are you sure to proceed?\nThe deleted ROM cannot be restored.',
        icon: 'icon-[mdi--delete]',
        name: 'delete',
        text: 'Delete the ROM',
      },
    ],
  } as const
  const actions = actionsMap[pageType]

  return { actions, pageType }
}
