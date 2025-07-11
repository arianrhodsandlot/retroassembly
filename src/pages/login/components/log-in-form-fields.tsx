import { TextField } from '@radix-ui/themes'

export function LoginFormFields() {
  return (
    <>
      <label>
        <div className='mb-2 font-medium'>Username</div>
        <TextField.Root maxLength={100} name='username' placeholder='e.g., admin, johnsmith, etc.' required>
          <TextField.Slot>
            <span className='icon-[mdi--user-card-details]' />
          </TextField.Slot>
        </TextField.Root>
      </label>

      <label>
        <div className='mb-2 font-medium'>Password</div>
        <TextField.Root name='password' required type='password'>
          <TextField.Slot>
            <span className='icon-[mdi--password]' />
          </TextField.Slot>
        </TextField.Root>
      </label>
    </>
  )
}
