import { Button } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { Link } from 'react-router'

export function LogInWithGoogleButton({ redirectTo }: { redirectTo: string }) {
  const [clicked, toggleClicked] = useToggle()

  function handleClick() {
    if (!clicked) {
      toggleClicked()
    }
  }
  return (
    <div className='text-center'>
      <Button asChild disabled={clicked} onClick={handleClick} size='3' type='submit' variant='soft'>
        <Link
          className='flex items-center gap-2'
          to={{
            pathname: '/login/google',
            search: `?redirect_to=${encodeURIComponent(redirectTo)}`,
          }}
        >
          <span className='icon-[logos--google-icon]' />
          Log in with Google
        </Link>
      </Button>
    </div>
  )
}
