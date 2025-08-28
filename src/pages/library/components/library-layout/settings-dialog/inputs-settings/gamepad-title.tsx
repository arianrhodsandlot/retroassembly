export function GamepadTitle({ id }: Readonly<{ id: string }>) {
  const separator = '('
  const [title, ...rest] = id.split(separator)
  const subtitle = rest.join(separator)
  return (
    <>
      <span>{title}</span>
      {subtitle ? <span className='text-xs opacity-50'>{`${separator}${subtitle}`}</span> : null}
    </>
  )
}
