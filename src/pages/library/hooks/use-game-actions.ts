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
        confirmDescription: t('dialog.confirmDeleteHistoryMessage'),
        icon: 'icon-[mdi--delete]',
        name: 'delete',
        text: t('game.deleteFromHistory'),
        type: 'launch_records',
      },
    ],
    library: [
      {
        confirmDescription: '',
        icon: 'icon-[mdi--checkbox-multiple-marked]',
        name: 'select',
        text: t('common.select'),
        type: '',
      },
      {
        color: 'red',
        confirmDescription: t('dialog.confirmDeleteRomsMessage'),
        icon: 'icon-[mdi--delete]',
        name: 'delete',
        text: t('game.deleteRom'),
        type: 'roms',
      },
    ],
  } as const

  const actions = actionsMap[pageType]
  return { actions, pageType }
}
