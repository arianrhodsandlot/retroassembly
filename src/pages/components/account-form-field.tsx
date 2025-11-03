import { IconButton, TextField } from '@radix-ui/themes'
import type { RootProps } from '@radix-ui/themes/components/text-field'
import { type FocusEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

function handleFocus(event: FocusEvent<HTMLInputElement>) {
  event.currentTarget.select()
}

interface LoginFormFieldProps extends RootProps {
  description?: string
  iconClass?: string
  label: string
}

export function AccountFormField({
  description,
  iconClass,
  label,
  type = 'text',
  ...props
}: Readonly<LoginFormFieldProps>) {
  const { t } = useTranslation()
  const [textFieldType, setTextFieldType] = useState(type)

  const iconButtonClass = textFieldType === 'password' ? 'icon-[mdi--eye]' : 'icon-[mdi--eye-off]'

  function handleClickIconButton() {
    setTextFieldType(textFieldType === 'password' ? 'text' : 'password')
  }

  return (
    <label>
      <div className='mb-2 font-medium'>{label}</div>
      <TextField.Root onFocus={handleFocus} required size='3' type={textFieldType} {...props}>
        <TextField.Slot>
          <span className={iconClass} />
        </TextField.Slot>
        {type === 'password' ? (
          <TextField.Slot>
            <IconButton
              onClick={handleClickIconButton}
              size='1'
              tabIndex={-1}
              title={textFieldType === 'password' ? t('Show password') : t('Hide password')}
              type='button'
              variant='ghost'
            >
              <span className={iconButtonClass} />
            </IconButton>
          </TextField.Slot>
        ) : null}
      </TextField.Root>
      {description ? <div className='mt-1 pl-2 text-xs opacity-50'>{description}</div> : null}
    </label>
  )
}
