import { DataList, Select, TextArea, TextField } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { range } from 'es-toolkit'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import { platformMap } from '@/constants/platform.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'

export function GameInfoDataList({ autoFocusField }: Readonly<{ autoFocusField?: string }>) {
  const { t } = useTranslation()
  const rom = useRom()

  const dataListFields = [
    {
      icon: 'icon-[mdi--calendar]',
      label: t('Released'),
      name: 'gameReleaseDate',
      placeholder: `e.g. ${DateTime.fromISO('1990-01-01').toISODate()}`,
      type: 'input' as const,
    },
    {
      icon: 'icon-[mdi--tag-multiple]',
      label: t('Genres'),
      name: 'gameGenres',
      type: 'input' as const,
    },
    {
      icon: 'icon-[mdi--person-multiple]',
      label: t('Players'),
      name: 'gamePlayers',
      options: [...range(1, 11).map((v) => `${v}`), 'unknown'],
      type: 'select' as const,
    },
    {
      icon: 'icon-[mdi--chip]',
      label: t('Developer'),
      name: 'gameDeveloper',
      type: 'input' as const,
    },
    {
      icon: 'icon-[mdi--earth]',
      label: t('Publisher'),
      name: 'gamePublisher',
      type: 'input' as const,
    },
    {
      icon: 'icon-[mdi--note]',
      label: t('Description'),
      name: 'gameDescription',
      type: 'textarea' as const,
    },
  ]

  const launchboxGame = rom.launchboxGame || {}
  const gameInfo = {
    gameDescription: rom.gameDescription ?? launchboxGame.overview,
    gameDeveloper: rom.gameDeveloper ?? launchboxGame.developer,
    gameGenres: rom.gameGenres ?? launchboxGame.genres,
    gamePlayers: rom.gamePlayers ?? launchboxGame.maxPlayers,
    gamePublisher: rom.gamePublisher ?? launchboxGame.publisher,
    gameReleaseDate: rom.gameReleaseDate ?? launchboxGame.releaseDate,
  }
  const date = new Date(gameInfo.gameReleaseDate)
  if (date.getTime()) {
    gameInfo.gameReleaseDate = DateTime.fromJSDate(date).setZone('utc').toISODate()
  }
  gameInfo.gamePlayers = Number.parseInt(gameInfo.gamePlayers, 10) ? `${gameInfo.gamePlayers}` : 'unknown'

  return (
    <DataList.Root className='py-4' orientation={{ initial: 'vertical', md: 'horizontal' }} size='3'>
      <DataList.Item>
        <DataList.Label className='-ml-2 flex items-center gap-2 text-sm lg:ml-0' minWidth='32px'>
          <span className='icon-[mdi--computer-classic]' />
          Platform
        </DataList.Label>
        <DataList.Value>{t(platformMap[rom.platform].displayName)}</DataList.Value>
      </DataList.Item>
      {dataListFields.map(({ icon, label, name, options, type, ...valueProps }) => (
        <DataList.Item key={name}>
          <DataList.Label className='-ml-2 flex items-center gap-2 text-sm lg:ml-0' minWidth='32px'>
            <span className={icon} />
            {label}
          </DataList.Label>
          <DataList.Value>
            {
              {
                input: (
                  <TextField.Root
                    aria-label={label}
                    autoFocus={autoFocusField === name}
                    className={clsx({ 'w-full': name === 'gameGenres' })}
                    defaultValue={gameInfo[name]}
                    name={name}
                    {...valueProps}
                  />
                ),
                select: (
                  <Select.Root defaultValue={`${gameInfo[name]}`} name={name}>
                    <Select.Trigger aria-label={label} autoFocus={autoFocusField === name} />
                    <Select.Content>
                      {options?.map((opt) => (
                        <Select.Item key={opt} value={opt}>
                          {opt}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                ),
                textarea: (
                  <TextArea
                    aria-label={label}
                    autoFocus={autoFocusField === name}
                    className='font-[Roboto_Slab_Variable]! w-full text-justify'
                    defaultValue={gameInfo[name]}
                    name={name}
                    resize='vertical'
                    rows={10}
                  />
                ),
              }[type]
            }
          </DataList.Value>
        </DataList.Item>
      ))}
    </DataList.Root>
  )
}
