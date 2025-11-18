import { Button, Callout, Tooltip } from '@radix-ui/themes'
import { Trans, useTranslation } from 'react-i18next'
import { metadata } from '#@/constants/metadata.ts'
import { useSettingsDialogOpen, useSettingsDialogTabName } from '#@/pages/library/atoms.ts'

interface BioseMissingMessageProps {
  bioses: {
    md5?: string | undefined
    name: string
    required?: boolean
  }[]
}

export function BioseMissingMessage({ bioses }: BioseMissingMessageProps) {
  const { t } = useTranslation()
  const [, setSettingsDialogOpen] = useSettingsDialogOpen()
  const [, setSettingsDialogTabName] = useSettingsDialogTabName()
  const tooltipContent = t(
    'A BIOS file is a copy of the operating system used by the hardware that we are emulating. Some emulators need BIOS files in order to correctly emulate hardware and/or software as needed by the content. {{title}} does not share any copyrighted system files or game content. You must provide your own BIOS and content in accordance with your local laws as applicable.',
    { title: metadata.title },
  )
  const biosList = bioses.map(({ name }) => name).join(', ')
  const tooltipTrigger = (
    <Tooltip content={tooltipContent}>
      <span className='inline-flex cursor-help items-center gap-0.5 underline decoration-dashed'>
        {t('BIOS')} <span className='icon-[mdi--question-mark-circle-outline]' />
      </span>
    </Tooltip>
  )

  function handleClickUpload() {
    setSettingsDialogOpen(true)
    setSettingsDialogTabName('emulating')
  }

  return (
    <Callout.Root>
      <Callout.Icon>
        <span className='icon-[mdi--lock] size-5' />
      </Callout.Icon>
      <Callout.Text>
        <Trans
          components={{
            strong: <b />,
            tooltip: tooltipTrigger,
          }}
          i18nKey='The game can not be launched without the required <tooltip/>: <strong>{{biosList}}</strong>.'
          values={{ biosList }}
        />{' '}
        <Button className='-mt-1!' onClick={handleClickUpload} size='1' type='button'>
          <span className='icon-[mdi--cog]' /> {t('Upload…')}
        </Button>
      </Callout.Text>
    </Callout.Root>
  )
}
