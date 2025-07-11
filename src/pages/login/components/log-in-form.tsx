import { Button } from '@radix-ui/themes'
import ky from 'ky'
import useSWRMutation from 'swr/mutation'
import { LoginFormFields } from './log-in-form-fields.tsx'

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const { trigger } = useSWRMutation('/api/v1/auth/login', async (url, { arg }: { arg: FormData }) => {
    await ky(url, {
      body: arg,
      method: 'POST',
    })
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    trigger(formData)
  }

  return (
    <form method='post' onSubmit={handleSubmit}>
      <input name='redirect_to' type='hidden' value={redirectTo} />
      <div className='flex flex-col gap-4'>
        <LoginFormFields />
        <Button type='submit'>Log in</Button>
      </div>
    </form>
  )
}
