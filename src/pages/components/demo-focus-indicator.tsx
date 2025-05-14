import { useEffect, useState } from 'react'

const positions = [
  { left: '0%', top: '0%' },
  { left: '33.33%', top: '0%' },
  { left: '33.33%', top: '50%' },
  { left: '66.67%', top: '50%' },
  { left: '66.67%', top: '0%' },
  { left: '33.33%', top: '0%' },
  { left: '33.33%', top: '50%' },
  { left: '0%', top: '50%' },
]

export function DemoFocusIndicator() {
  const [step, setStep] = useState(0)
  const position = positions[step]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prevStep) => (prevStep + 1) % positions.length)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <div className='bg-(--accent-a4) absolute h-1/2 w-1/3 rounded transition-[top,left]' style={position} />
}
