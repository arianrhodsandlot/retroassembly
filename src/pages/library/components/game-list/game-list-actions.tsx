import { Button, DropdownMenu } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import { useSelectedGames } from '../../atoms.ts'
import { useIsDemo } from '../../hooks/use-demo.ts'
import { useRoms } from '../../hooks/use-roms.ts'
import { DeleteDialog } from './delete-dialog.tsx'

export function GameListActions() {
  const { roms } = useRoms()
  const [selectedGames, setSelectedGames] = useSelectedGames()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { t } = useTranslation()
  const { pathname, search } = useLocation()
  const isDemo = useIsDemo()

  const isHistory = pathname === '/library/history'

  if (isDemo || isHistory) {
    return
  }

  const searchParams = new URLSearchParams(search)
  const direction = searchParams.get('direction') || 'asc'
  const sort = searchParams.get('sort') || 'name'

  return (
    <div
      className={clsx('flex px-4', {
        'justify-between': selectedGames.length > 0,
        'justify-end': selectedGames.length === 0,
      })}
    >
      {selectedGames.length > 0 ? (
        <>
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
        </>
      ) : (
        <div>
          <div />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant='soft'>
                <span className='icon-[mdi--sort]' />
                {t('Sort')}
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Label>{t('Sort By')}</DropdownMenu.Label>
              {[
                { icon: 'icon-[mdi--pencil]', label: t('Name'), value: 'name' },
                { icon: 'icon-[mdi--clock]', label: t('Date Added'), value: 'added' },
                { icon: 'icon-[mdi--calendar]', label: t('Released'), value: 'released' },
              ].map(({ icon, label, value }) => (
                <DropdownMenu.Item asChild key={value}>
                  <Link to={[pathname, new URLSearchParams({ direction, sort: value })].join('?')}>
                    <span className={clsx('icon-[mdi--check]', { 'opacity-0': value !== sort })} />
                    <span className={icon} />
                    {label}
                  </Link>
                </DropdownMenu.Item>
              ))}

              <DropdownMenu.Separator />

              <DropdownMenu.Label>{t('Sort Direction')}</DropdownMenu.Label>
              {[
                { icon: 'icon-[mdi--sort-ascending]', label: t('Ascending'), value: 'asc' },
                { icon: 'icon-[mdi--sort-descending]', label: t('Descending'), value: 'desc' },
              ].map(({ icon, label, value }) => (
                <DropdownMenu.Item asChild key={value}>
                  <Link to={[pathname, new URLSearchParams({ direction: value, sort })].join('?')}>
                    <span className={clsx('icon-[mdi--check]', { 'opacity-0': value !== direction })} />
                    <span className={icon} />
                    {label}
                  </Link>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      )}
    </div>
  )
}
