import { Paralolas } from './parabola.tsx'
import { Pong } from './pong.tsx'

export function VisualEffect() {
  return (
    <>
      <div className='absolute top-0 size-full'>
        <Pong />
      </div>
      <div className='absolute top-0 size-full'>
        <Paralolas />
      </div>
    </>
  )
}
