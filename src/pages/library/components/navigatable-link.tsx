'use client'
import { Link } from 'waku'
import type { LinkProps } from 'waku/router/client'
import { PendingMaskController } from './pending-mask/pending-mask-controller.ts'

export function NavigatableLink({ ...props }: LinkProps) {
  return <Link data-sn-enabled scroll unstable_pending={<PendingMaskController />} {...props} />
}
