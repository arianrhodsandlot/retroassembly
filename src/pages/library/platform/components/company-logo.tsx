import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { getCDNUrl } from '@/utils/cdn.ts'

const knownCompanyMap = new Map(
  Object.entries({
    '3do': '3do.svg',
    atari: 'atari.png',
    atlus: 'atlus.svg',
    banpresto: 'banpresto.svg',
    capcom: 'capcom.svg',
    dataeast: 'dataeast.svg',
    gaelco: 'gaelco.svg',
    gottlieb: 'gottlieb.svg',
    igs: 'igs.svg',
    irem: 'irem.svg',
    jaleco: 'jaleco.svg',
    konami: 'konami.svg',
    midway: 'midway.svg',
    namco: 'namco.svg',
    nichibutsu: 'nichibutsu.svg',
    nintendo: 'nintendo.svg',
    pgm: 'pgm.png',
    psikyo: 'psikyo.svg',
    sega: 'sega.svg',
    seibu: 'seibu.svg',
    snk: 'snk.svg',
    taito: 'taito.svg',
    technos: 'technos.svg',
    tecmo: 'tecmo.svg',
  }),
)

const repo = 'Mattersons/es-theme-neutral'
function getCompanyLogo(company: string) {
  if (!company) {
    return
  }

  const companyLower = company.toLowerCase()
  if (knownCompanyMap.has(companyLower)) {
    const fileName = knownCompanyMap.get(companyLower)
    return getCDNUrl(repo, `systems/logo/${fileName}`)
  }

  for (const [knownCompany, fileName] of knownCompanyMap.entries()) {
    if (companyLower.includes(knownCompany)) {
      return getCDNUrl(repo, `systems/logo/${fileName}`)
    }
  }
}

export function CompanyLogo({
  className,
  company,
  fallback,
}: { className?: string; company: string; fallback?: ReactNode }) {
  const companyLogo = getCompanyLogo(company)
  if (companyLogo) {
    return (
      <img
        alt={company}
        className={clsx(twMerge('object-contain object-center', className))}
        src={companyLogo}
        title={company}
      />
    )
  }
  return fallback
}
