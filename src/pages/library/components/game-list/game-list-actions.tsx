import { Button } from '@radix-ui/themes'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelectedGames } from '../../atoms.ts'
import { useRoms } from '../../hooks/use-roms.ts'
import { DeleteDialog } from './delete-dialog.tsx'

export function GameListActions() {
  const { roms } = useRoms()
  const [selectedGames, setSelectedGames] = useSelectedGames()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {selectedGames.length > 0 ? (
        <motion.div
          animate={{ height: 'auto', opacity: 1 }}
          className='flex justify-between px-4'
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
        >
          <div className='flex items-center gap-2'>
            <span className='icon-[mdi--order-checkbox-ascending]' />
            <Trans
              components={{
                1: <span className='text-(--accent-9) font-semibold' />,
              }}
              i18nKey='Selected <1>{{count}}</1> {{items}}'
              values={{
                count: selectedGames.length,
                items: t('ROM', { count: selectedGames.length }),
              }}
            />

            <AnimatePresence>
              {selectedGames.length < roms.length ? (
                <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }} layout>
                  <Button onClick={() => setSelectedGames(roms.map(({ id }) => id))} type='button' variant='soft'>
                    <span className='icon-[mdi--check-all]' />
                    {t('Select all')}
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className='flex gap-2'>
            <Button onClick={() => setDeleteDialogOpen(true)} type='button' variant='soft'>
              <span className='icon-[mdi--delete]' />
              {t('Delete selected {{count}} {{items}}', {
                count: selectedGames.length,
                items: t('ROM', { count: selectedGames.length }),
              })}
            </Button>
            <DeleteDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen} />

            <Button onClick={() => setSelectedGames([])} type='button' variant='soft'>
              <span className='icon-[mdi--close]' />
              {t('Cancel')}
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
