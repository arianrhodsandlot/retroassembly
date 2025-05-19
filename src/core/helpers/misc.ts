import { isThisYear, isToday, lightFormat } from 'date-fns'
import { parse } from 'goodcodes-parser'
import { capitalize } from 'lodash-es'
import { getCDNHost } from '../constants/dependencies'
import { platformFullNameMap } from '../constants/platforms'

const repositoryVersions = {
  'libretro-thumbnails/Atari_-_2600': 'a6a54d3', // https://github.com/libretro-thumbnails/Atari_-_2600
  'libretro-thumbnails/Atari_-_5200': '972acae', // https://github.com/libretro-thumbnails/Atari_-_5200
  'libretro-thumbnails/Atari_-_7800': '8485e01', // https://github.com/libretro-thumbnails/Atari_-_7800
  'libretro-thumbnails/Atari_-_Lynx': '3d74e8b', // https://github.com/libretro-thumbnails/Atari_-_Lynx
  'libretro-thumbnails/Bandai_-_WonderSwan': '5ff3f34', // https://github.com/libretro-thumbnails/Bandai_-_WonderSwan
  'libretro-thumbnails/Bandai_-_WonderSwan_Color': 'da7bfcf', // https://github.com/libretro-thumbnails/Bandai_-_WonderSwan_Color
  'libretro-thumbnails/FBNeo_-_Arcade_Games': '11eab0a', // https://github.com/libretro-thumbnails/FBNeo_-_Arcade_Games
  'libretro-thumbnails/MAME': '9e34662', // https://github.com/libretro-thumbnails/MAME
  'libretro-thumbnails/Nintendo_-_Family_Computer_Disk_System': '0933747', // https://github.com/libretro-thumbnails/Nintendo_-_Family_Computer_Disk_System
  'libretro-thumbnails/Nintendo_-_Game_Boy': '64ff8b2', // https://github.com/libretro-thumbnails/Nintendo_-_Game_Boy
  'libretro-thumbnails/Nintendo_-_Game_Boy_Advance': '0be0f4e', // https://github.com/libretro-thumbnails/Nintendo_-_Game_Boy_Advance
  'libretro-thumbnails/Nintendo_-_Game_Boy_Color': '2c54e12', // https://github.com/libretro-thumbnails/Nintendo_-_Game_Boy_Color
  'libretro-thumbnails/Nintendo_-_Nintendo_Entertainment_System': '6331423', // https://github.com/libretro-thumbnails/Nintendo_-_Nintendo_Entertainment_System
  'libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System': 'e524bb6', // https://github.com/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System
  'libretro-thumbnails/Nintendo_-_Virtual_Boy': '7569309', // https://github.com/libretro-thumbnails/Nintendo_-_Virtual_Boy
  'libretro-thumbnails/Sega_-_32X': 'eea9df0', // https://github.com/libretro-thumbnails/Sega_-_32X
  'libretro-thumbnails/Sega_-_Game_Gear': '92d0fb7', // https://github.com/libretro-thumbnails/Sega_-_Game_Gear
  'libretro-thumbnails/Sega_-_Master_System_-_Mark_III': 'e35e8e6', // https://github.com/libretro-thumbnails/Sega_-_Master_System_-_Mark_III
  'libretro-thumbnails/Sega_-_Mega_Drive_-_Genesis': 'fa29730', // https://github.com/libretro-thumbnails/Sega_-_Mega_Drive_-_Genesis
  'libretro-thumbnails/Sega_-_SG-1000': '3a0e965', // https://github.com/libretro-thumbnails/Sega_-_SG-1000
  'libretro-thumbnails/SNK_-_Neo_Geo_Pocket': '3932af2', // https://github.com/libretro-thumbnails/SNK_-_Neo_Geo_Pocket
  'libretro-thumbnails/SNK_-_Neo_Geo_Pocket_Color': '2b397b7', // https://github.com/libretro-thumbnails/SNK_-_Neo_Geo_Pocket_Color
}

function encodeRFC3986URIComponent(str) {
  return encodeURIComponent(str).replaceAll(/[!'()*]/g, (c) => `%${c.codePointAt(0)?.toString(16).toUpperCase()}`)
}

export function getCover({ platform, name, type = 'boxart' }) {
  if (!name || !platform) {
    return ''
  }
  const platformFullName = platformFullNameMap[platform]
  if (!platformFullName) {
    return ''
  }

  const typeUrlPart = `Named_${capitalize(type)}s`
  const normalizedPlatformFullName = platformFullName.replaceAll(' ', '_')
  const repo = `libretro-thumbnails/${normalizedPlatformFullName}`
  const pathPrefix = `gh/${repo}@${repositoryVersions[repo] || 'master'}`
  const normalizedFileName = name.replaceAll(/[&*/:`<>?\\]|\|"/g, '_')
  const encode = encodeRFC3986URIComponent
  return `${getCDNHost()}/${pathPrefix}/${encode(typeUrlPart)}/${encode(normalizedFileName)}.png`
}

export function parseGoodCode(name: string) {
  const goodCodeResult = parse(`0 - ${name}`)
  goodCodeResult.file = goodCodeResult.file.slice(4)
  return goodCodeResult
}

export function humanizeDate(date: Date) {
  if (isToday(date)) {
    return lightFormat(date, 'HH:mm:ss')
  }
  if (isThisYear(date)) {
    return lightFormat(date, 'MM-dd HH:mm')
  }
  return lightFormat(date, 'yyyy-MM-dd HH:mm')
}

export async function getScript(url: string) {
  const script = document.createElement('script')
  script.src = url
  document.body.append(script)
  await new Promise<void>((resolve, reject) => {
    script.addEventListener('load', () => {
      resolve()
    })
    script.addEventListener('error', (error) => {
      reject(error)
    })
  })
  script.remove()
}
