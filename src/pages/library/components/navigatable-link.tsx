import { Link, type LinkProps } from 'react-router'

export function NavigatableLink({ ...props }: LinkProps) {
  return <Link data-sn-enabled {...props} />
}
