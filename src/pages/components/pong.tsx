import { sample } from 'es-toolkit'
import { useLayoutEffect, useRef, useState } from 'react'

interface PongState {
  ballSpeedX: number
  ballSpeedY: number
  ballX: number
  ballY: number
  paddleLeftY: number
  paddleRightY: number
}

const PADDLE_HEIGHT = 100
const PADDLE_WIDTH = 20
const BALL_RADIUS = 16
const PADDLE_MOVE_FACTOR = 0.1 // Controls how fast paddles react
const MAX_PADDLE_SPEED = 8 // Maximum speed paddles can move

const FILL_STYLE = '#999'

export function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<null | PongState>(null)
  const animationFrameId = useRef<null | number>(null)

  // Initialize game state and canvas size
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) {
      return
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { height, width } = entry.contentRect
        canvas.width = width
        canvas.height = height

        // Initialize or reset game state on resize
        setGameState({
          ballSpeedX: 5 * sample([-1, 1]), // Initial random horizontal direction
          ballSpeedY: 5 * sample([-1, 1]), // Initial random vertical direction
          ballX: width / 2,
          ballY: height / 2,
          paddleLeftY: height / 2 - PADDLE_HEIGHT / 2,
          paddleRightY: height / 2 - PADDLE_HEIGHT / 2,
        })
      }
    })

    resizeObserver.observe(container)

    // Initial size setup
    const initialWidth = container.clientWidth
    const initialHeight = container.clientHeight
    canvas.width = initialWidth
    canvas.height = initialHeight
    setGameState({
      ballSpeedX: 5 * sample([-1, 1]),
      ballSpeedY: 5 * sample([-1, 1]),
      ballX: initialWidth / 2,
      ballY: initialHeight / 2,
      paddleLeftY: initialHeight / 2 - PADDLE_HEIGHT / 2,
      paddleRightY: initialHeight / 2 - PADDLE_HEIGHT / 2,
    })

    return () => {
      resizeObserver.disconnect()
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  // Game loop
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !gameState) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const currentGameState = { ...gameState }

    function gameLoop() {
      if (!canvas || !ctx) {
        return
      }
      const { height, width } = canvas

      // Update ball position
      currentGameState.ballX += currentGameState.ballSpeedX
      currentGameState.ballY += currentGameState.ballSpeedY

      // Update paddle positions (simple AI)
      const paddleCenterLeft = currentGameState.paddleLeftY + PADDLE_HEIGHT / 2
      const paddleCenterRight = currentGameState.paddleRightY + PADDLE_HEIGHT / 2

      // Left paddle movement: only if ball is moving left
      if (currentGameState.ballSpeedX < 0) {
        const diffYLeft = currentGameState.ballY - paddleCenterLeft
        // Move paddle only if the ball is significantly off-center
        if (Math.abs(diffYLeft) > PADDLE_HEIGHT / 4) {
          // Add a dead zone
          let speedLeft = Math.abs(diffYLeft) * PADDLE_MOVE_FACTOR
          speedLeft = Math.min(speedLeft, MAX_PADDLE_SPEED) // Clamp speed
          currentGameState.paddleLeftY += speedLeft * Math.sign(diffYLeft)
        }
      }

      // Right paddle movement: only if ball is moving right
      if (currentGameState.ballSpeedX > 0) {
        const diffYRight = currentGameState.ballY - paddleCenterRight
        // Move paddle only if the ball is significantly off-center
        if (Math.abs(diffYRight) > PADDLE_HEIGHT / 4) {
          // Add a dead zone
          let speedRight = Math.abs(diffYRight) * PADDLE_MOVE_FACTOR
          speedRight = Math.min(speedRight, MAX_PADDLE_SPEED) // Clamp speed
          currentGameState.paddleRightY += speedRight * Math.sign(diffYRight)
        }
      }

      // Keep paddles within bounds
      currentGameState.paddleLeftY = Math.max(0, Math.min(height - PADDLE_HEIGHT, currentGameState.paddleLeftY))
      currentGameState.paddleRightY = Math.max(0, Math.min(height - PADDLE_HEIGHT, currentGameState.paddleRightY))

      // Ball collision with top/bottom walls
      if (currentGameState.ballY - BALL_RADIUS < 0 || currentGameState.ballY + BALL_RADIUS > height) {
        currentGameState.ballSpeedY *= -1
        // Adjust position slightly to prevent sticking
        currentGameState.ballY = Math.max(BALL_RADIUS, Math.min(height - BALL_RADIUS, currentGameState.ballY))
      }

      // Ball collision with paddles
      // Left paddle
      if (
        currentGameState.ballX - BALL_RADIUS < PADDLE_WIDTH &&
        currentGameState.ballY > currentGameState.paddleLeftY &&
        currentGameState.ballY < currentGameState.paddleLeftY + PADDLE_HEIGHT &&
        currentGameState.ballSpeedX < 0 // Ensure it's moving left
      ) {
        currentGameState.ballSpeedX *= -1
        currentGameState.ballX = PADDLE_WIDTH + BALL_RADIUS // Prevent sticking
      }

      // Right paddle
      if (
        currentGameState.ballX + BALL_RADIUS > width - PADDLE_WIDTH &&
        currentGameState.ballY > currentGameState.paddleRightY &&
        currentGameState.ballY < currentGameState.paddleRightY + PADDLE_HEIGHT &&
        currentGameState.ballSpeedX > 0 // Ensure it's moving right
      ) {
        currentGameState.ballSpeedX *= -1
        currentGameState.ballX = width - PADDLE_WIDTH - BALL_RADIUS // Prevent sticking
      }

      // Ball out of bounds (reset) - Optional, or just let it bounce off paddles
      if (currentGameState.ballX - BALL_RADIUS < 0 || currentGameState.ballX + BALL_RADIUS > width) {
        // Reset ball to center if it goes past a paddle (simple reset)
        // currentGameState.ballX = width / 2;
        // currentGameState.ballY = height / 2;
        // currentGameState.ballSpeedX *= sample([-1, 1]); // Random direction again
        // currentGameState.ballSpeedY *= sample([-1, 1]);
        // Or simply reverse direction if it hits the absolute edge (less realistic for Pong)
        // currentGameState.ballSpeedX *= -1;
      }

      // --- Drawing ---
      ctx.clearRect(0, 0, width, height)

      // Draw paddles
      ctx.fillStyle = FILL_STYLE
      ctx.fillRect(0, currentGameState.paddleLeftY, PADDLE_WIDTH, PADDLE_HEIGHT) // Left paddle
      ctx.fillRect(width - PADDLE_WIDTH, currentGameState.paddleRightY, PADDLE_WIDTH, PADDLE_HEIGHT) // Right paddle

      // Draw ball
      ctx.beginPath()
      ctx.arc(currentGameState.ballX, currentGameState.ballY, BALL_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = FILL_STYLE
      ctx.fill()
      ctx.closePath()

      // --- End Drawing ---

      // Update state for next frame (optional, could directly modify ref if preferred)
      // setGameState({ ...currentGameState }); // This causes re-renders, better to manage state within the loop

      animationFrameId.current = requestAnimationFrame(gameLoop)
    }

    // Start the loop
    animationFrameId.current = requestAnimationFrame(gameLoop)

    // Cleanup function
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [gameState]) // Rerun loop logic if initial gameState changes

  return (
    <div ref={containerRef} style={{ height: '100%', overflow: 'hidden', position: 'relative', width: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', height: '100%', width: '100%' }} />
    </div>
  )
}
