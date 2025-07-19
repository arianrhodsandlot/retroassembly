export function MainBackground({ alt, src }: { alt?: string; src?: string }) {
  return src ? (
    <div className='blur-xs pointer-events-none absolute right-0 aspect-square h-full'>
      <img alt={alt || ''} className='absolute size-full object-cover object-center' src={src} />
      <div className='bg-linear-to-l from-(--color-background)/30 to-(--color-background) absolute top-0 size-full' />
      <div className='bg-linear-to-b from-(--color-background)/30 to-(--color-background) absolute top-0 size-full' />
    </div>
  ) : null
}
