'use client'
import { Link, type LinkProps } from 'react-router'
// import { PendingMaskController } from './pending-mask/pending-mask-controller.ts'

export function NavigatableLink({ ...props }: LinkProps) {
  return <Link data-sn-enabled {...props} />
}
