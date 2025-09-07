import { clsx } from 'clsx'

interface HeaderLinkItemProps {
  link?: {
    iconClass?: string
    iconUrl?: string
    text: string
  }
}

export function HeaderLinkItem({ link }: Readonly<HeaderLinkItemProps>) {
  if (link) {
    return (
      <div className='flex items-center gap-1'>
        {link.iconClass ? <span className={clsx('size-5', link.iconClass)} /> : null}
        {link.iconUrl ? <img alt={link.text} className='size-5' src={link.iconUrl} /> : null}
        {link.text}
      </div>
    )
  }
}
