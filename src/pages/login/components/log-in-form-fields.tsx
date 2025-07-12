import { TextField } from '@radix-ui/themes'
import type { FocusEvent } from 'react'

function handleFocus(event: FocusEvent<HTMLInputElement>) {
  event.currentTarget.select()
}

export function LoginFormFields({ register = false }: { register?: boolean }) {
  return (
    <>
      <label>
        <div className='mb-2 font-medium'>Username</div>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <TextField.Root autoFocus name='username' onFocus={handleFocus} required>
          <TextField.Slot>
            <span className='icon-[mdi--user-card-details]' />
          </TextField.Slot>
        </TextField.Root>
        {register ? <div className='mt-1 pl-2 text-xs opacity-50'>E.g., johnsmith, admin, etc.</div> : null}
      </label>

      <label>
        <div className='mb-2 font-medium'>Password</div>
        <TextField.Root name='password' onFocus={handleFocus} required type='password'>
          <TextField.Slot>
            <span className='icon-[mdi--password]' />
          </TextField.Slot>
        </TextField.Root>
        {register ? (
          <div className='mt-1 pl-2 text-xs opacity-50'>
            Recommendation: 10+ characters with letters, numbers, and symbols.
          </div>
        ) : null}
      </label>

      {register ? (
        <label>
          <div className='mb-2 font-medium'>Repeat password</div>
          <TextField.Root name='repeat_password' onFocus={handleFocus} required type='password'>
            <TextField.Slot>
              <span className='icon-[mdi--password-check]' />
            </TextField.Slot>
          </TextField.Root>
        </label>
      ) : null}
    </>
  )
}
