import { random } from 'es-toolkit'
import { motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'

// Gaming and retro themed icon paths
const ICON_PATHS = [
  'icon-[mdi--gamepad]',
  'icon-[mdi--nintendo-game-boy]',
  'icon-[mdi--space-invaders]',
  'icon-[mdi--zelda]',
  'icon-[iconoir--pacman]',
  'icon-[mdi--gamepad-square]',
  'icon-[fluent--tetris-app-24-regular]',
  'icon-[wpf--retro-tv]',
  'icon-[teenyicons--gba-outline]',
  'icon-[mdi--gamepad-variant]',
  'icon-[mdi--controller]',
  'icon-[mdi--chip]',
  'icon-[mdi--star]',
  'icon-[mdi--heart]',
  'icon-[iconoir--trophy]',
  'icon-[ri--ghost-2-line]',
  'icon-[game-icons--mushroom]',
  'icon-[game-icons--fire]',
  'icon-[game-icons--star-medal]',
]

// Different animation patterns for more variety with smoother opacity transitions
const ANIMATION_PATTERNS = [
  // Simple upward float with smoother fading
  (position: { x: number; y: number }, xOffset: number, yOffset: number) => ({
    opacity: [0, 0.1, 0.3, 0.6, 0.7, 0.6, 0.3, 0.1, 0],
    rotate: [0, random(-360, 360)],
    x: [position.x, position.x + xOffset],
    y: [position.y, position.y + yOffset],
  }),
  // Zigzag upward float with smoother fading
  (position: { x: number; y: number }, xOffset: number, yOffset: number) => ({
    opacity: [0, 0.1, 0.3, 0.6, 0.7, 0.6, 0.4, 0.2, 0],
    rotate: [0, random(-180, 180), random(-360, 360)],
    x: [
      position.x,
      position.x + xOffset / 3,
      position.x,
      position.x - xOffset / 3,
      position.x,
      position.x + xOffset / 2,
      position.x,
      position.x - xOffset / 2,
      position.x + xOffset,
    ],
    y: [
      position.y,
      position.y + yOffset * 0.12,
      position.y + yOffset * 0.25,
      position.y + yOffset * 0.37,
      position.y + yOffset * 0.5,
      position.y + yOffset * 0.62,
      position.y + yOffset * 0.75,
      position.y + yOffset * 0.87,
      position.y + yOffset,
    ],
  }),
  // Swirl pattern with smoother fading
  (position: { x: number; y: number }, xOffset: number, yOffset: number) => ({
    opacity: [0, 0.1, 0.3, 0.5, 0.7, 0.6, 0.4, 0.2, 0],
    rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
    x: [
      position.x,
      position.x + xOffset * 0.25,
      position.x + xOffset * 0.5,
      position.x + xOffset * 0.75,
      position.x + xOffset,
      position.x + xOffset * 0.75,
      position.x + xOffset * 0.5,
      position.x + xOffset * 0.25,
      position.x,
    ],
    y: [
      position.y,
      position.y + yOffset * 0.12,
      position.y + yOffset * 0.25,
      position.y + yOffset * 0.37,
      position.y + yOffset * 0.5,
      position.y + yOffset * 0.62,
      position.y + yOffset * 0.75,
      position.y + yOffset * 0.87,
      position.y + yOffset,
    ],
  }),
]

interface FloatingIconProps {
  animationPattern: number
  className: string
  delay: number
  duration: number
  icon: string
  initialOpacity: number
  position: { x: number; y: number }
  size: number
  uniqueKey: string
}

function FloatingIcon({
  animationPattern,
  className,
  delay,
  duration,
  icon,
  initialOpacity,
  position,
  size,
  uniqueKey,
}: FloatingIconProps) {
  const xOffset = random(-80, 80)
  const yOffset = -150 - random(0, 200)
  const repeatDelay = random(0, 4)

  // Select animation pattern
  const pattern = ANIMATION_PATTERNS[animationPattern % ANIMATION_PATTERNS.length]
  const animationProps = pattern(position, xOffset, yOffset)

  return (
    <motion.div
      animate={animationProps}
      className={`pointer-events-none absolute ${className}`}
      initial={{ opacity: initialOpacity, x: position.x, y: position.y }}
      key={uniqueKey}
      style={{ fontSize: size }}
      transition={{
        delay,
        duration,
        ease: [0.2, 0.4, 0.6, 0.8], // Custom easing for smoother transitions
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay,
        times: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.8, 0.9, 1], // Control timing of keyframes for smoother transitions
      }}
    >
      <div className={icon} />
    </motion.div>
  )
}

export function Background() {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 })

  // Generate random icons with their properties
  const icons = useMemo(() => {
    // Dramatically increased icon count for a much denser animation
    const iconCount = 120

    // Create a denser grid system for better distribution
    const gridCols = 12
    const gridRows = 12
    const cellWidth = (dimensions.width || 1200) / gridCols
    const cellHeight = (dimensions.height || 800) / gridRows

    // Create icons in multiple layers for a more immersive effect
    return Array.from({ length: iconCount }, (_, i) => {
      // Distribute icons across the grid with significant randomness
      const gridCol = i % gridCols
      const gridRow = Math.floor(i / gridCols) % gridRows

      // Determine randomization approach based on chance
      const randomizationApproach = random(0, 100)

      let baseX, baseY

      if (randomizationApproach < 70) {
        // Standard approach with enhanced randomness - 70% of icons
        // Use larger randomOffset for more variation within the cell
        const randomOffset = random(0.5, 1.5) // Increased upper bound for more randomness
        baseX = gridCol * cellWidth + random(0, cellWidth * randomOffset)
        baseY = gridRow * cellHeight + random(0, cellHeight * randomOffset)
      } else if (randomizationApproach < 90) {
        // Full screen random position - 20% of icons
        baseX = random(0, dimensions.width || 1200)
        baseY = random(0, dimensions.height || 800)
      } else {
        // Cluster effect - 10% of icons will appear in random clusters
        // Pick a random location and place the icon near it
        const anchorX = random(0, dimensions.width || 1200)
        const anchorY = random(0, dimensions.height || 800)
        baseX = anchorX + random(-100, 100)
        baseY = anchorY + random(-100, 100)
      }

      // Ensure icons stay within viewport boundaries
      baseX = Math.max(0, Math.min(baseX, (dimensions.width || 1200) - 20))
      baseY = Math.max(0, Math.min(baseY, (dimensions.height || 800) - 20))

      const randomIconIndex = Math.floor(random(0, ICON_PATHS.length - 1))
      const randomIcon = ICON_PATHS[randomIconIndex]

      // Stagger the delays but ensure some icons appear immediately
      // About 30% of icons will appear immediately (zero delay)
      let delay
      if (i % 3 === 0) {
        delay = 0 // Immediate appearance for about 1/3 of icons
      } else if (i % 3 === 1) {
        delay = random(0, 5) // Short delay for another 1/3
      } else {
        delay = random(5, 20) // Longer delay for the remaining 1/3
      }

      // Varied durations based on position to create layered effect
      const duration = 4 + random(0, 12)

      const animationPattern = Math.floor(random(0, ANIMATION_PATTERNS.length))

      // Vary size more dramatically based on "depth" to create 3D-like effect
      // Smaller icons appear further away, larger ones closer
      let size
      const depthFactor = random(0, 1)
      if (depthFactor > 0.8) {
        // Largest (closest)
        size = 28 + Math.floor(random(0, 22))
      } else if (depthFactor > 0.6) {
        // Large
        size = 20 + Math.floor(random(0, 18))
      } else if (depthFactor > 0.3) {
        // Medium
        size = 14 + Math.floor(random(0, 14))
      } else {
        // Small (furthest)
        size = 10 + Math.floor(random(0, 10))
      }

      // Vary opacity and color based on "depth" - now using lighter colors
      let opacityClass
      if (depthFactor > 0.8) {
        opacityClass = 'opacity-70 text-gray-300'
      } else if (depthFactor > 0.6) {
        opacityClass = 'opacity-65 text-gray-300'
      } else if (depthFactor > 0.4) {
        opacityClass = 'opacity-60 text-gray-300'
      } else if (depthFactor > 0.2) {
        opacityClass = 'opacity-55 text-gray-300'
      } else {
        opacityClass = 'opacity-50 text-gray-300'
      }

      // For icons with zero delay, increase initial opacity for immediate visibility
      const initialOpacity = delay === 0 ? 0.2 : 0

      const uniqueKey = `icon-${randomIcon}-${baseX}-${baseY}-${Date.now()}-${random(0, 1000)}`

      return {
        animationPattern,
        className: opacityClass,
        delay,
        duration,
        icon: randomIcon,
        initialOpacity,
        position: { x: baseX, y: baseY },
        size,
        uniqueKey,
      }
    })
  }, [dimensions])

  // Update dimensions on mount and resize
  useEffect(() => {
    // Create initial dimensions state
    const initialDimensions = {
      height: window.innerHeight,
      width: window.innerWidth,
    }

    // Set initial dimensions outside the handler
    if (dimensions.width === 0 && dimensions.height === 0) {
      setDimensions(initialDimensions)
    }

    // Create handler for resize events
    function handleResize() {
      const newDimensions = {
        height: window.innerHeight,
        width: window.innerWidth,
      }

      // Only update if dimensions actually changed
      if (newDimensions.width !== dimensions.width || newDimensions.height !== dimensions.height) {
        setDimensions(newDimensions)
      }
    }

    // Add resize listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dimensions])

  return (
    <div className='relative size-full overflow-hidden'>
      {icons.map((icon) => (
        <FloatingIcon
          animationPattern={icon.animationPattern}
          className={icon.className}
          delay={icon.delay}
          duration={icon.duration}
          icon={icon.icon}
          initialOpacity={icon.initialOpacity}
          key={icon.uniqueKey}
          position={icon.position}
          size={icon.size}
          uniqueKey={icon.uniqueKey}
        />
      ))}
    </div>
  )
}
