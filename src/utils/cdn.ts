import { encodeRFC3986URIComponent } from './misc.ts'

const repositoryVersions = {
  'batocera-linux/batocera-themes': 'cc0de2f',
  'HerbFargus/es-theme-tronkyfran': 'a270311',
  'KyleBing/retro-game-console-icons': 'b0f42b0',
  'libretro-thumbnails/Atari_-_2600': 'a6a54d3',
  'libretro-thumbnails/Atari_-_5200': '972acae',
  'libretro-thumbnails/Atari_-_7800': '8485e01',
  'libretro-thumbnails/Atari_-_Lynx': '3d74e8b',
  'libretro-thumbnails/Bandai_-_WonderSwan': '5ff3f34',
  'libretro-thumbnails/Bandai_-_WonderSwan_Color': 'da7bfcf',
  'libretro-thumbnails/FBNeo_-_Arcade_Games': '5209042',
  'libretro-thumbnails/Nintendo_-_Family_Computer_Disk_System': '0933747',
  'libretro-thumbnails/Nintendo_-_Game_Boy': '9db9910',
  'libretro-thumbnails/Nintendo_-_Game_Boy_Advance': '8eb37c7',
  'libretro-thumbnails/Nintendo_-_Game_Boy_Color': '2c54e12',
  'libretro-thumbnails/Nintendo_-_Nintendo_Entertainment_System': 'dbac0d8',
  'libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System': '59a8381',
  'libretro-thumbnails/Nintendo_-_Virtual_Boy': '7569309',
  'libretro-thumbnails/Sega_-_32X': 'eea9df0',
  'libretro-thumbnails/Sega_-_Game_Gear': '92d0fb7',
  'libretro-thumbnails/Sega_-_Master_System_-_Mark_III': 'e35e8e6',
  'libretro-thumbnails/Sega_-_Mega_Drive_-_Genesis': 'fa29730',
  'libretro-thumbnails/Sega_-_SG-1000': '3a0e965',
  'libretro-thumbnails/SNK_-_Neo_Geo_Pocket': '3932af2',
  'libretro-thumbnails/SNK_-_Neo_Geo_Pocket_Color': '2b397b7',
  'libretro/docs': '57b4824',
  'libretro/retroarch-assets': '9afd2b8',
  'Mattersons/es-theme-neutral': 'c9b38e7',
  'RetroPie/es-theme-carbon': 'b09973e',
} as const

export const cdnHost = 'https://cdn.jsdelivr.net'

export function getCDNUrl(repo: keyof typeof repositoryVersions, filePpath: string) {
  const [ghUser, ghRepoName] = repo.split('/')
  const version = repositoryVersions[repo]
  const url = new URL('', cdnHost)
  const encode = encodeRFC3986URIComponent
  const urlPathSegments = ['gh', encode(ghUser), `${encode(ghRepoName)}@${encode(version)}`, filePpath]
  const urlPath = urlPathSegments.join('/')
  url.pathname = urlPath
  return url.href
}
