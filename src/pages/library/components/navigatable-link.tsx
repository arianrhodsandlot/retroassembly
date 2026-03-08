import { NavLink, type NavLinkProps } from 'react-router'

export function NavigatableLink({ ...props }: Readonly<NavLinkProps>) {
  return <NavLink end data-sn-enabled {...props} />
}
