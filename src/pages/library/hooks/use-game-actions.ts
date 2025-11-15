import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

export function useGameActions() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const pageType = pathname === '/library/history' ? 'history' : 'library'

  const actionsMap = {
    history: [
      {
        color: 'red',
        confirmDescription: t(
          'Are you sure to proceed?\nThe deleted history item cannot be restored.\nThe ROM related to this history item will NOT be deleted.',
        ),
        icon: 'icon-[mdi--delete]',
        name: 'delete',
        text: t('Delete from history'),
        type: 'launch_records',
      },
    ],
    library: [
      {
        confirmDescription: '',
        icon: 'icon-[mdi--checkbox-multiple-marked]',
        name: 'select',
        text: t('Select'),
        type: '',
      },
      {
        color: 'red',
        confirmDescription: t('Are you sure to proceed?\nThe deleted ROMs cannot be restored.'),
        icon: 'icon-[mdi--delete]',
        name: 'delete',
        text: t('Delete the ROM'),
        type: 'roms',
      },
    ],
  } as const

  const actions = actionsMap[pageType]
  return { actions, pageType }
}
