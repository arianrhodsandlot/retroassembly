import { encodeRFC3986URIComponent } from './misc.ts'

const repositoryVersions = {
  'arianrhodsandlot/retroassembly-assets': '657978eba57dd4920d57436feaa5dbb7a775e5eb', // https://github.com/arianrhodsandlot/retroassembly-assets/commits
  'libretro-thumbnails/Atari_-_2600': '13f3b4c2393c79f8f03850609067fe9db5da40a1', // https://github.com/libretro-thumbnails/Atari_-_2600/commits
  'libretro-thumbnails/Atari_-_5200': '30b60c8a3bf2eff5c977ca09e909b9ef06a8c5c0', // https://github.com/libretro-thumbnails/Atari_-_5200/commits
  'libretro-thumbnails/Atari_-_7800': 'c8190373b1d1c1fb7a82c351fbca880fab9d1993', // https://github.com/libretro-thumbnails/Atari_-_7800/commits
  'libretro-thumbnails/Atari_-_Lynx': '2ac8b3a787035ce5924a88d88ad346e171fbe18a', // https://github.com/libretro-thumbnails/Atari_-_Lynx/commits
  'libretro-thumbnails/Bandai_-_WonderSwan': 'aa3cfe8a087b33ae0864f22745f3f49827a3583e', // https://github.com/libretro-thumbnails/Bandai_-_WonderSwan/commits
  'libretro-thumbnails/Bandai_-_WonderSwan_Color': '4937a9a5c69a9fde504fe6593916ab606784af9c', // https://github.com/libretro-thumbnails/Bandai_-_WonderSwan_Color/commits
  'libretro-thumbnails/Coleco_-_ColecoVision': '17a09fab3eef20022e5f19022c7aa4dab5cef163', // https://github.com/libretro-thumbnails/Coleco_-_ColecoVision/commits
  'libretro-thumbnails/Fairchild_-_Channel_F': 'f4463eafc549fe8dd371becc107a153f9d5e9b53', // https://github.com/libretro-thumbnails/Fairchild_-_Channel_F/commits
  'libretro-thumbnails/FBNeo_-_Arcade_Games': '7a4f51c8c1bb5cc469aa32acf7511f76a75f62ac', // https://github.com/libretro-thumbnails/FBNeo_-_Arcade_Games/commits
  'libretro-thumbnails/Handheld_Electronic_Game': 'a717495b41498c469ff4579797a6bf4e76fb766a', // https://github.com/libretro-thumbnails/Handheld_Electronic_Game/commits
  'libretro-thumbnails/Magnavox_-_Odyssey2': '63e9a9e0359c0bc24174b9eaba03e590bae3ab58', // https://github.com/libretro-thumbnails/Magnavox_-_Odyssey2/commits
  'libretro-thumbnails/MAME': '4cac1368aa80bb3a60a1e0549d82c5b778f82b58', // https://github.com/libretro-thumbnails/MAME/commits
  'libretro-thumbnails/NEC_-_PC_Engine_-_TurboGrafx_16': '488bcadd66ba83c473ba55f29ce1e0f6b3bf823e', // https://github.com/libretro-thumbnails/NEC_-_PC_Engine_-_TurboGrafx_16/commits
  'libretro-thumbnails/Nintendo_-_Family_Computer_Disk_System': '09337470d081504faee7b0b6bcee0bdf8182c292', // https://github.com/libretro-thumbnails/Nintendo_-_Family_Computer_Disk_System/commits
  'libretro-thumbnails/Nintendo_-_Game_Boy': 'd963e89e95c1fe48df9fdb88ccb60f7d1ffc68d3', // https://github.com/libretro-thumbnails/Nintendo_-_Game_Boy/commits
  'libretro-thumbnails/Nintendo_-_Game_Boy_Advance': '1d180fd504e63eff98cb94653eff2ddcd5d03647', // https://github.com/libretro-thumbnails/Nintendo_-_Game_Boy_Advance/commits
  'libretro-thumbnails/Nintendo_-_Game_Boy_Color': '2c54e12ed7d9acd3124497bf5a9b107ab69d0d41', // https://github.com/libretro-thumbnails/Nintendo_-_Game_Boy_Color/commits
  'libretro-thumbnails/Nintendo_-_Nintendo_Entertainment_System': '3a643f8f02de91356b34d21b95d2c2b68d859915', // https://github.com/libretro-thumbnails/Nintendo_-_Nintendo_Entertainment_System/commits
  'libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System': '8ab381469ab76eb65d6db494fc6195a84c3ef4de', // https://github.com/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System/commits
  'libretro-thumbnails/Nintendo_-_Virtual_Boy': '75693093d5c9bce8fc61ec073877384c47c82cb6', // https://github.com/libretro-thumbnails/Nintendo_-_Virtual_Boy/commits
  'libretro-thumbnails/Philips_-_Videopac': '2a43c1d80347b2f2d8122e49adb8f7366eb15551', // https://github.com/libretro-thumbnails/Philips_-_Videopac/commits
  'libretro-thumbnails/Sega_-_32X': 'eea9df070a32a4fb0765353327aba3c4608e7066', // https://github.com/libretro-thumbnails/Sega_-_32X/commits
  'libretro-thumbnails/Sega_-_Game_Gear': '3064122416ceab894340f35caf1f641713abb51d', // https://github.com/libretro-thumbnails/Sega_-_Game_Gear/commits
  'libretro-thumbnails/Sega_-_Master_System_-_Mark_III': '7561221e20c398326268b5aa9dbe48ba967cf45c', // https://github.com/libretro-thumbnails/Sega_-_Master_System_-_Mark_III/commits
  'libretro-thumbnails/Sega_-_Mega_Drive_-_Genesis': 'fa297306ef552f00b0a5b0f2569a8df883d7aea6', // https://github.com/libretro-thumbnails/Sega_-_Mega_Drive_-_Genesis/commits
  'libretro-thumbnails/Sega_-_SG-1000': '3a0e96504581c36cbb8a0d6860099565142ef7fd', // https://github.com/libretro-thumbnails/Sega_-_SG-1000/commits
  'libretro-thumbnails/SNK_-_Neo_Geo_Pocket': '3932af2130b55ae1d666632c79fc99515ed5438c', // https://github.com/libretro-thumbnails/SNK_-_Neo_Geo_Pocket/commits
  'libretro-thumbnails/SNK_-_Neo_Geo_Pocket_Color': '2b397b7b0a7e0056cfe787599578ddf8724f1859', // https://github.com/libretro-thumbnails/SNK_-_Neo_Geo_Pocket_Color/commits
  'libretro/docs': '35b22b41444b7d547d7f239669332c634acb455b', // https://github.com/libretro/docs/commits
  'libretro/retroarch-assets': '2d24ef2972a709f870cc3f73853158fa2376f37d', // https://github.com/libretro/retroarch-assets/commits
  'Mattersons/es-theme-neutral': 'c9b38e7265d680d3da68e96df1bc2ed1cfefb79f', // https://github.com/Mattersons/es-theme-neutral/commits
  'retrobrews/gba-games': 'add86969f1a7a3b9534822a9a015d05ed20a0dcf', // https://github.com/retrobrews/gba-games/commits
  'retrobrews/gbc-games': 'a23861c19f1b4d1eeea129879f3a30b709f1f48f', // https://github.com/retrobrews/gbc-games/commits
  'retrobrews/md-games': '69799854cb357a252ff5eda173381feb5e81aac5', // https://github.com/retrobrews/md-games/commits
  'retrobrews/nes-games': 'd20061bf9917e8bb8b947d4dba8c59372f5762a0', // https://github.com/retrobrews/nes-games/commits
  'retrobrews/snes-games': '2329cb432b4cad13aa6a9d2ad0699c771780b378', // https://github.com/retrobrews/snes-games/commits
} as const

export const cdnHost = 'https://cdn.jsdelivr.net/'

export function getCDNUrl(repo: keyof typeof repositoryVersions, filePpath: string) {
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
