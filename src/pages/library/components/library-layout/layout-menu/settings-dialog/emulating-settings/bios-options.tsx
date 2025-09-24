import { Button, IconButton } from '@radix-ui/themes'
import { fileOpen } from 'browser-fs-access'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'

export function BIOSOptions({ platform }: { platform: string }) {
  const { isLoading, preference, update } = usePreference()

  function handleClickDelete() {
    console.info(update)
  }

  async function handleClickUpload() {
    const file = await fileOpen()
    console.info(file)
    console.info(update)
  }

  const { bios } = preference.emulator.platform[platform]

  return (
    <div>
      <SettingsTitle as='h4'>
        <span className='icon-[mdi--chip]' /> BIOS
      </SettingsTitle>
      <div className='flex flex-wrap gap-2 px-6'>
        {bios.map(({ fileName }) => (
          <span className='inline-flex items-center gap-1 rounded px-2' key={fileName}>
            <span className='icon-[mdi--file]' />
            {fileName}
            <IconButton onClick={handleClickDelete} size='1' type='button' variant='ghost'>
              <span className='icon-[mdi--close]' />
            </IconButton>
          </span>
        ))}
        <Button disabled={isLoading} onClick={handleClickUpload} size='2' variant='soft'>
          <span className='icon-[mdi--upload]' />
          Upload
        </Button>
      </div>
    </div>
  )
}
