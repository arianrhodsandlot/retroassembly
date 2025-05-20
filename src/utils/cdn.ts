import { encodeRFC3986URIComponent } from './misc.ts'

const repositoryVersions = {
  'batocera-linux/batocera-themes': 'cc0de2f', // https://github.com/batocera-linux/batocera-themes
  'HerbFargus/es-theme-tronkyfran': 'a270311', // https://github.com/HerbFargus/es-theme-tronkyfran
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
  'libretro/docs': '4bee6d6', // https://github.com/libretro/docs
  'libretro/retroarch-assets': '818aca5', // https://github.com/libretro/retroarch-assets
  'Mattersons/es-theme-neutral': 'c9b38e7', // https://github.com/Mattersons/es-theme-neutral
  'retrobrews/gba-games': 'add8696', // https://github.com/retrobrews/gba-games
  'retrobrews/gbc-games': 'a23861c', // https://github.com/retrobrews/gbc-games
  'retrobrews/md-games': '6979985', // https://github.com/retrobrews/md-games
  'retrobrews/nes-games': 'd20061b', // https://github.com/retrobrews/nes-games
  'retrobrews/snes-games': '2329cb4', // https://github.com/retrobrews/snes-games
  'RetroPie/es-theme-carbon': 'b09973e', // https://github.com/RetroPie/es-theme-carbon
  'Weestuarty/codywheel-es-de': '7aa24c4', // https://github.com/Weestuarty/codywheel-es-de
  'Weestuarty/diamond-es-de': '553c913', // https://github.com/Weestuarty/diamond-es-de
  'Weestuarty/lcars-es-de': 'bdb7340', // https://github.com/Weestuarty/lcars-es-de
} as const

export const cdnHost = 'https://cdn.jsdelivr.net/'

export function getCDNUrl(repo: keyof typeof repositoryVersions | string, filePpath: string) {
  const [ghUser, ghRepoName] = repo.split('/')
  const version = repositoryVersions[repo]
  const url = new URL('', cdnHost)
  const encode = encodeRFC3986URIComponent
  const urlPathSegments = [
    'gh',
    encode(ghUser),
    version ? `${encode(ghRepoName)}@${encode(version)}` : encode(ghRepoName),
    filePpath,
  ]
  const urlPath = urlPathSegments.join('/')
  url.pathname = urlPath
  return url.href
}
