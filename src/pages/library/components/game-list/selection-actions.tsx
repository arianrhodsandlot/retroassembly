import { Button } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'

interface SelectionActionsProps {
  selectedCount: number
  onDelete: () => void
  onCancel: () => void
}

export function SelectionActions({ selectedCount, onDelete, onCancel }: SelectionActionsProps) {
  const { t } = useTranslation()

  return (
    <div className='flex gap-2'>
      <Button onClick={onDelete} type='button' variant='soft'>
        <span className='icon-[mdi--delete]' />
        {t('game.deleteSelectedItems', {
          count: selectedCount,
          items: t('game.rom', { count: selectedCount }),
        })}
      </Button>

      <Button onClick={onCancel} type='button' variant='soft'>
        <span className='icon-[mdi--close]' />
        {t('common.cancel')}
      </Button>
    </div>
  )
}
