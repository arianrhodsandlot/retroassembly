import { Kbd, TextField } from '@radix-ui/themes'

const select = <TextField.Root className='w-10' />

export function KeyboardInputs() {
  return (
    <div>
      <div className='flex gap-4'>
        <label className='flex items-center gap-2'>
          <span className='icon-[mdi--gamepad-left] size-8' />
          {select}
        </label>
        <label className='flex items-center gap-2'>
          <span className='icon-[mdi--gamepad-right] size-8' />
          {select}
        </label>
        <label className='flex items-center gap-2'>
          <span className='icon-[mdi--gamepad-up] size-8' />
          {select}
        </label>
        <label className='flex items-center gap-2'>
          <span className='icon-[mdi--gamepad-down] size-8' />
          {select}
        </label>
      </div>
      <div className='mt-2 flex gap-4'>
        <label className='flex items-center gap-2'>
          <span className='icon-[mdi--gamepad-circle-down] size-8' />
          {select}
        </label>
        <label className='flex items-center gap-2'>
          <span className='icon-[mdi--gamepad-circle-left] size-8' />
          {select}
        </label>
        <label className='flex items-center gap-2'>
          <span className='icon-[mdi--gamepad-circle-right] size-8' />
          {select}
        </label>
        <label className='flex items-center gap-2'>
          <span className='icon-[mdi--gamepad-circle-up] size-8' />
          {select}
        </label>
      </div>

      <div className='mt-2 flex gap-4'>
        <label className='flex items-center gap-2'>
          <Kbd>L1</Kbd>
          {select}
        </label>
        <label className='flex items-center gap-2'>
          <Kbd>L2</Kbd>
          {select}
        </label>
        <label className='flex items-center gap-2'>
          <Kbd>R1</Kbd>
          {select}
        </label>
        <label className='flex items-center gap-2'>
          <Kbd>R2</Kbd>
          {select}
        </label>
        <label className='flex items-center gap-2'>
          <Kbd>L3</Kbd>
          {select}
        </label>
        <label className='flex items-center gap-2'>
          <Kbd>R3</Kbd>
          {select}
        </label>
      </div>

      <div className='mt-2 flex gap-4'>
        <label className='flex items-center gap-2'>
          <Kbd>Select</Kbd>
          {select}
        </label>
        <label className='flex items-center gap-2'>
          <Kbd>Start</Kbd>
          {select}
        </label>
      </div>
    </div>
  )
}
