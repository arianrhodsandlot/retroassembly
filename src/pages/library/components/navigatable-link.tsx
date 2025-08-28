import { Link, type LinkProps } from 'react-router'

export function NavigatableLink({ ...props }: Readonly<LinkProps>) {
  return <Link data-sn-enabled {...props} />
}
