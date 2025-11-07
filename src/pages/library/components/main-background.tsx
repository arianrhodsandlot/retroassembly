export function MainBackground({ alt, src }: { alt?: string; src?: string }) {
  return src ? (
    <div className='blur-xs -z-1 fixed right-0 top-0 aspect-square w-full lg:h-full lg:w-auto'>
      <img alt={alt || ''} className='absolute size-full object-cover object-center' loading='lazy' src={src} />
      <div className='bg-linear-to-l from-(--color-background)/30 to-(--color-background) absolute top-0 size-full transition-colors duration-500' />
      <div className='bg-linear-to-b from-(--color-background)/30 to-(--color-background) absolute top-0 size-full transition-colors duration-500' />
    </div>
  ) : null
}
