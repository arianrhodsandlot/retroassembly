import { uniqueId } from 'es-toolkit/compat'
import type { Roms } from './get-roms'

const roms = [
  { fileName: 'flappybird.nes', platform: 'nes' },
  { fileName: 'babelblox.nes', platform: 'nes' },
  { fileName: 'blaster.nes', platform: 'nes' },
  { fileName: 'bronyblaster.nes', platform: 'nes' },
  { fileName: 'lala.nes', platform: 'nes' },
  { fileName: 'cheril-the-goddess.nes', platform: 'nes' },

  { fileName: '30yearsofnintendont.bin', platform: 'genesis' },
  { fileName: 'barbarian.bin', platform: 'genesis' },
  { fileName: 'cavestory.bin', platform: 'genesis' },
  { fileName: 'crazycars.bin', platform: 'genesis' },
  { fileName: 'papicommandotennis.bin', platform: 'genesis' },

  { fileName: 'hilda.smc', platform: 'snes' },
  { fileName: 'horizontal-shooter.smc', platform: 'snes' },
  { fileName: 'megafamilybros.smc', platform: 'snes' },
  { fileName: 'nwarpdaisakusen.smc', platform: 'snes' },
  { fileName: 'superbossgaiden.smc', platform: 'snes' },

  { fileName: 'bustamove.bin', platform: 'gba' },
  { fileName: 'chocoboworlddeluxe.gba', platform: 'gba' },
  { fileName: 'cosmic.gba', platform: 'gba' },
  { fileName: 'gapman.gba', platform: 'gba' },
  { fileName: 'metalwarrior4.gba', platform: 'gba' },
].map((rom) => ({ ...rom, id: uniqueId() })) as Roms

export function getDemoRoms({ platform }: { platform?: string } = {}) {
  if (platform) {
    return roms.filter((rom) => rom.platform === platform)
  }
  return roms
}
