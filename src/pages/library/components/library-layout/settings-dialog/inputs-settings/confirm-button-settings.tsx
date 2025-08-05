import { RadioCards } from '@radix-ui/themes'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'

const rightButtonIcon = <span className='icon-[mdi--gamepad-circle-right] text-lg' />
const downButtonIcon = <span className='icon-[mdi--gamepad-circle-down] text-lg' />
const switchIcon = <span className='icon-[mdi--nintendo-switch] text-lg text-[#e60012]' />
const xboxIcon = <span className='icon-[mdi--microsoft-xbox] text-lg text-[#107c10]' />

export function ConfirmButtonSettings() {
  const { isLoading, preference, update } = usePreference()

  async function handleConfirmButtonChange(value: string) {
    if (value !== preference.input.confirmButtonStyle) {
      await update({ input: { confirmButtonStyle: value } })
    }
  }

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--gamepad-circle]' />
        Confirm and Cancel Buttons
      </SettingsTitle>
      <div className='w-lg px-6'>
        <RadioCards.Root
          columns='1'
          defaultValue='1'
          disabled={isLoading}
          onValueChange={handleConfirmButtonChange}
          value={preference.input.confirmButtonStyle}
        >
          <RadioCards.Item value='nintendo'>
            <div className='flex items-center gap-1'>
              {switchIcon} Nintendo Style (Use {rightButtonIcon} as confirm,
              {downButtonIcon} as cancel)
            </div>
          </RadioCards.Item>
          <RadioCards.Item value='xbox'>
            <div className='flex items-center gap-1'>
              {xboxIcon} Xbox Style (Use {downButtonIcon} as confirm,
              {rightButtonIcon} as cancel)
            </div>
          </RadioCards.Item>
        </RadioCards.Root>
        <div className='mt-2 text-xs opacity-80'>
          This only affects navigation in the library and does not change inputs in games.
        </div>
      </div>
    </div>
  )
}
