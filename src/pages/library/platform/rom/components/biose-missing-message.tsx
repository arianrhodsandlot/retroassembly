import { Button, Callout, Tooltip } from '@radix-ui/themes'
import { metadata } from '@/constants/metadata.ts'
import { useSettingsDialogOpen, useSettingsDialogTabName } from '@/pages/library/atoms.ts'

interface BioseMissingMessageProps {
  bioses: {
    md5?: string | undefined
    name: string
    required: boolean
  }[]
}

export function BioseMissingMessage({ bioses }: BioseMissingMessageProps) {
  const [, setSettingsDialogOpen] = useSettingsDialogOpen()
  const [, setSettingsDialogTabName] = useSettingsDialogTabName()

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
        The game can not be launched without the required{' '}
        <Tooltip
          content={`A BIOS file is a copy of the operating system used by the hardware that we are emulating. Some emulators need BIOS files in order to correctly emulate hardware and/or software as needed by the content. ${metadata.title} does not share any copyrighted system files or game content. You must provide your own BIOS and content in accordance with your local laws as applicable.`}
        >
          <span className='inline-flex cursor-help items-center gap-0.5 underline decoration-dashed'>
            BIOS <span className='icon-[mdi--question-mark-circle-outline]' />
          </span>
        </Tooltip>
        : <b>{bioses.map(({ name }) => name).join(',')}</b>.{' '}
        <Button className='!-mt-1' onClick={handleClickUpload} size='1' type='button'>
          <span className='icon-[mdi--cog]' /> Upload…
        </Button>
      </Callout.Text>
    </Callout.Root>
  )
}
