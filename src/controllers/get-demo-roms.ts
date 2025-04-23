import { sortBy } from 'es-toolkit'
import { uniqueId } from 'es-toolkit/compat'
import type { Roms } from './get-roms'

// @ts-expect-error demo roms
const roms = [
  {
    desc: "Flappy Bird is a one button game where you need to get a bird trough pipes, while not colliding with it. As said there is only one button, so with this button you can give your bird some height, but the height is being reduced immediate again. So you need to keep clicking and keep the correct height, which isn't easy at all.",
    fileName: 'flappybird.nes',
    name: 'Flappy Bird',
    platform: 'nes',
  },
  {
    desc: 'In the land of Shinar, the people are building a tower to elevate themselves to the level of God. Take on the role of God, and scramble the language of the people and scatter them on the earth! Use twitch-style skills to recognize different languages and stop blocks from being added to the construction of the tower. Choose from a variety of languages to use, and get the people separated!',
    fileName: 'babelblox.nes',
    name: 'Babel Blox',
    platform: 'nes',
  },
  {
    desc: 'Sliding Blaster by NovaSquirrel, a homebrew NES game released in 2014.',
    fileName: 'blaster.nes',
    name: 'Blaster',
    platform: 'nes',
  },
  {
    desc: "The story is that MLP got cancelled and bronies are going mad, rioting all over the world. They have taken over buildings and you have to free them. The game is going to be a platformer but for now it's more of a boss rush than anything else, but still gives you an idea of the game... Use A to jump, B to attack and arrow keys to move (Duh!) Start pauses the game (Re-Duh!). This game is not meant to be taken seriously, it's just a joke.",
    fileName: 'bronyblaster.nes',
    name: 'Brony Blaster',
    platform: 'nes',
  },
  {
    desc: "Help Lala get the Wand and travel to the Sky Palace to find the three Power Gems! Just because she's bored!",
    fileName: 'lala.nes',
    name: 'Lala',
    platform: 'nes',
  },
  {
    desc: 'Cheril must obtain the Skull of Podewwwr and use its power to become a goddess. In order to do so, she must open three gates and unlock a magic column. The gates are magically locked by the temples of Stone, Paper and Scissors. You must break the seals using the proper medallion in each temple, which you have to find. The magic column is unlocked using a key in the keyhole located next to the column. Cheril can get three magic charges from the pedestals with two hearts engraved. He can use such charges to gain super powers for a short while (being able to fly around and becoming invin-cible) or to activate teleporters which will take her to the center of the map. You can open the gates and the magic column in any order. You can also take a look at a map telling you where everything is located. You can only carry one object at a time. Controls:	D-pad: Movement; Select: Continue (title screen) / Map (ingame); Start: Starts the game from the beginning (title screen) / Pause; B: Interact / use / action, etc.; A: Jump; B + UP: Activate super powers.',
    fileName: 'cheril-the-goddess.nes',
    name: 'Cheril the Goddess',
    platform: 'nes',
  },

  {
    desc: 'As a Sega evangelist, you\'ll have to convince players to leave their NES console and avoid the SNES because "Genesis does what Nintendon\'t".  How much market share can you earn thanks to your knowledge of the Megadrive / Genesis games library?',
    fileName: '30yearsofnintendont.bin',
    name: '30 Years of Nintendont',
    platform: 'genesis',
  },
  {
    desc: 'In the game, the player is Hegor, a barbarian who must traverse several dungeons and underground habitats to defeat his brother, the evil sorcerer Necron. He has a sword and bow in his arsenal of weapons. Running and jumping, as with many platform games, comprises a large part of the gameplay of this title.',
    fileName: 'barbarian.bin',
    name: 'Barbarian',
    platform: 'genesis',
  },
  {
    desc: 'The player controls the on-screen character directly using the keyboard or gamepad. The player progresses by navigating platform game puzzles and shooting enemies with the equipped weapon. This is a rewrite/port of the popular freeware game Cave Story for Sega Mega Drive/Genesis.',
    fileName: 'cavestory.bin',
    name: 'Cave Story',
    platform: 'genesis',
  },
  {
    desc: 'Remake of the best racing game of Amstrad CPC released in 1988.',
    fileName: 'crazycars.bin',
    name: 'Crazy Cars',
    platform: 'genesis',
  },
  {
    desc: 'This is the new Demo of Papi Tennis ! You can play with a Friend or against AI for training of a 1 set Match !! Controls: PAD - Move Papi; Button A - Normal Shoot; UP & Button A - Long Shoot; DOWN & Button A - Short Shoot; Button A & Button B - Power Shoot; Button START - Pause Game.',
    fileName: 'papicommandotennis.bin',
    name: 'Papi Commando Tennis',
    platform: 'genesis',
  },

  {
    desc: 'She sets to find her sister, and attain revenge for her parents death, along with the future restoration of her kingdom. What will happen next?',
    fileName: 'hilda.smc',
    name: 'Hilda',
    platform: 'snes',
  },
  {
    desc: 'A simple SNES horizontal shooter demo game. Controls: D-Pad - Move Ship; B - Shoot',
    fileName: 'horizontal-shooter.smc',
    name: 'Horizontal Shooter',
    platform: 'snes',
  },
  {
    desc: 'The game is supposed to be a Jump\'n\'Run game, combining the gameplay of "Megaman" and "Super Mario"',
    fileName: 'megafamilybros.smc',
    name: 'Mega Family Bros',
    platform: 'snes',
  },
  {
    desc: 'N-Warp Daisakusen is a deathmatch minigame for eight human players. Connect two Multitaps and eight joypads to your SNES, invite some friends and compete for the first place by beating and kicking the shit out of the other players.',
    fileName: 'nwarpdaisakusen.smc',
    name: 'N Warp Daisakusen',
    platform: 'snes',
  },
  {
    desc: "This game is so much fun, wreck 'em all enemies in your way is so cool, the music is so great too.",
    fileName: 'superbossgaiden.smc',
    name: 'Super Boss Gaiden',
    platform: 'snes',
  },

  {
    desc: 'Full clone of the original Bust-A-Move (also known as Puzzle Bobble), made by Taito in 1994 for the Neo-Geo arcade system. The game is extremely faithful to the original in every respect. Contains 30 arcade levels in single player mode, and also included Link play with two modes of game play. The classic "Deathmatch" style of play, and a race mode which uses the single player boards where the first to clear the screen wins.',
    fileName: 'bustamove.bin',
    name: 'Bust-A-Move',
    platform: 'gba',
  },
  {
    desc: 'Save our friend Mog from Demon King!',
    fileName: 'chocoboworlddeluxe.gba',
    name: 'Chocobo World Deluxe',
    platform: 'gba',
  },
  { desc: 'This is a clone of the Sega game Cosmic Smash.', fileName: 'cosmic.gba', name: 'Cosmic', platform: 'gba' },
  { desc: 'Faithful remake of Pacman.', fileName: 'gapman.gba', name: 'Gapman', platform: 'gba' },
  {
    desc: 'In the violent near future, there existed a war/thrash metal band CYBERPRIEST, whose music brought strength and hope to the hessians struggling from day to day. You are asked to assume the control of IAN on his journey to the unknown. As the game begins he is his usual self but an initiation and transformation into Agent form awaits..',
    fileName: 'metalwarrior4.gba',
    name: 'Metal Warrior 4',
    platform: 'gba',
  },
].map((rom) => ({ ...rom, id: uniqueId() })) as Roms

export function getDemoRoms({ platform }: { platform?: string } = {}) {
  if (platform) {
    return sortBy(
      roms.filter((rom) => rom.platform === platform),
      ['name'],
    )
  }
  return sortBy(roms, ['name'])
}
