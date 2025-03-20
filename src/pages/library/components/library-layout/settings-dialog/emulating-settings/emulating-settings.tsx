import { CoresSettings } from './cores-settings.tsx'
import { ShaderSettings } from './shader-settings.tsx'

export function EmulatingSettings() {
  return (
    <div className='flex flex-col gap-4'>
      <ShaderSettings />
      <CoresSettings />
    </div>
  )
}
