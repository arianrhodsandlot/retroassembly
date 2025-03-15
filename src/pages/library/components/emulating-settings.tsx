import { Select } from '@radix-ui/themes'
import { platforms } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/rom.ts'

export function EmulatingSettings() {
  return (
    <div className='mt-4'>
      <h3 className='flex items-center gap-2 py-2 text-lg font-semibold'>
        <span className='icon-[mdi--computer-classic]' /> Platform
      </h3>
      <Select.Root defaultValue='arcade' size='3'>
        <Select.Trigger variant='ghost' />
        <Select.Content>
          {platforms.map((platform) => (
            <Select.Item key={platform.name} value={platform.name}>
              <div className='flex items-center gap-2'>
                <img
                  alt={platform.displayName}
                  className='size-6 object-contain object-center'
                  src={getPlatformIcon(platform.name, '')}
                />
                {platform.displayName}
              </div>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <h3 className='flex items-center gap-2 py-2 text-lg font-semibold'>
        <span className='icon-[mdi--monitor-screenshot]' /> Emulator
      </h3>
      <Select.Root defaultValue='arcade' size='3'>
        <Select.Trigger variant='ghost' />
        <Select.Content>
          {platforms
            .find(({ name }) => name === 'nes')
            .cores.map((core) => (
              <Select.Item key={core} value={core}>
                <div className='flex items-center gap-2'>
                  <span className='icon-[mdi--jigsaw]' />
                  {core}
                </div>
              </Select.Item>
            ))}
        </Select.Content>
      </Select.Root>

      <h3 className='flex items-center gap-2 py-2 text-lg font-semibold'>
        <span className='icon-[mdi--wrench]' /> Emulator Options
      </h3>
    </div>
  )
}
