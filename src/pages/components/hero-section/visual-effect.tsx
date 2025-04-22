import { Background } from './background.tsx'
import { Paralolas } from './parabola.tsx'

export function VisualEffect() {
  return (
    <>
      <div className='absolute top-0 size-full'>
        <Background />
      </div>
      <div className='absolute top-0 size-full'>
        <Paralolas />
      </div>
    </>
  )
}
