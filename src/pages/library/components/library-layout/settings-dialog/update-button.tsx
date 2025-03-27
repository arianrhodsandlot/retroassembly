import { Button, type ButtonProps } from '@radix-ui/themes'
import type { PreferenceSnippet } from '@/constants/preference'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'

interface ResetButtonProps extends ButtonProps {
  preference: PreferenceSnippet
}

export function UpdateButton({ preference, ...props }: ResetButtonProps) {
  const { isLoading, update } = usePreference()

  async function handleClickReset() {
    await update(preference)
  }
  return (
    <Button type='button' {...props} disabled={isLoading} onClick={handleClickReset} size='2' variant='soft'>
      {props.children}
    </Button>
  )
}
