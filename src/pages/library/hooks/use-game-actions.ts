import { useLocation } from 'react-router'

const actionsMap = {
  history: [
    {
      color: 'red',
      confirmDescription:
        'Are you sure to proceed?\nThe deleted history item cannot be restored.\nThe ROM related to this history item will NOT be deleted.',
      icon: 'icon-[mdi--delete]',
      name: 'delete',
      text: 'Delete from history',
      type: 'launch_records',
    },
  ],
  library: [
    {
      confirmDescription: '',
      icon: 'icon-[mdi--checkbox-multiple-marked]',
      name: 'select',
      text: 'Select',
      type: '',
    },
    {
      color: 'red',
      confirmDescription: 'Are you sure to proceed?\nThe deleted ROM cannot be restored.',
      icon: 'icon-[mdi--delete]',
      name: 'delete',
      text: 'Delete the ROM',
      type: 'roms',
    },
  ],
} as const

export function useGameActions() {
  const { pathname } = useLocation()
  const pageType = pathname === '/library/history' ? 'history' : 'library'
  const actions = actionsMap[pageType]
  return { actions, pageType }
}
