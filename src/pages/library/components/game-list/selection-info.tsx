import { Button } from '@radix-ui/themes'
import { AnimatePresence, motion } from 'motion/react'
import { Trans, useTranslation } from 'react-i18next'

interface SelectionInfoProps {
  selectedCount: number
  canSelectAll: boolean
  onSelectAll: () => void
}

export function SelectionInfo({ selectedCount, canSelectAll, onSelectAll }: SelectionInfoProps) {
  const { t } = useTranslation()

  return (
    <div className='flex items-center gap-2'>
      <span className='icon-[mdi--order-checkbox-ascending]' />
      <Trans
        components={{
          1: <span className='font-semibold text-(--accent-9)' />,
        }}
        i18nKey='Selected <1>{{count}}</1> {{items}}'
        values={{
          count: selectedCount,
          items: t('ROM', { count: selectedCount }),
        }}
      />

      <AnimatePresence>
        {canSelectAll ? (
          <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }} layout>
            <Button onClick={onSelectAll} type='button' variant='soft'>
              <span className='icon-[mdi--check-all]' />
              {t('Select all')}
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
