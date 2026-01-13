import { RadioCards } from '@radix-ui/themes'
import { Trans, useTranslation } from 'react-i18next'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'

const rightButtonIcon = <span className='icon-[mdi--gamepad-circle-right] text-lg' />
const downButtonIcon = <span className='icon-[mdi--gamepad-circle-down] text-lg' />
const switchIcon = <span className='icon-[mdi--nintendo-switch] text-lg text-[#e60012]' />
const xboxIcon = <span className='icon-[mdi--microsoft-xbox] text-lg text-[#107c10]' />

export function ConfirmButtonSettings() {
  const { t } = useTranslation()
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
        {t('Confirm and Cancel Buttons')}
      </SettingsTitle>
      <div className='px-6 lg:w-sm'>
        <RadioCards.Root
          columns='1'
          defaultValue='1'
          disabled={isLoading}
          onValueChange={handleConfirmButtonChange}
          value={preference.input.confirmButtonStyle}
        >
          <RadioCards.Item value='nintendo'>
            {switchIcon} {t('Nintendo Style')}
          </RadioCards.Item>
          <span className='-mt-2 flex flex-wrap items-center gap-1 text-sm'>
            <Trans
              components={{
                downButton: downButtonIcon,
                rightButton: rightButtonIcon,
              }}
              i18nKey='Nintendo button explanation'
            />
          </span>

          <RadioCards.Item value='xbox'>
            {xboxIcon} {t('Xbox Style')}
          </RadioCards.Item>
          <span className='-mt-2 flex flex-wrap items-center gap-1 text-sm'>
            <Trans
              components={{
                downButton: downButtonIcon,
                rightButton: rightButtonIcon,
              }}
              i18nKey='Xbox button explanation'
            />
          </span>
        </RadioCards.Root>
        <div className='mt-3 text-xs opacity-80'>
          {t('This only affects navigation in the library and does not change inputs in games.')}
        </div>
      </div>
    </div>
  )
}
