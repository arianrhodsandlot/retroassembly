import { sortBy } from 'es-toolkit'
import { uniqueId } from 'es-toolkit/compat'
import type { Roms } from './get-roms'

// @ts-expect-error demo roms
const roms = [
  {
    desc: 'We would like to share with you all our own Multicart. 31 real games! Lots of laughs! Facepalms! Controllers flying accross the room! Mysterious secrets! Fake names! Repeat games with different sprites! Everything in 3 megabits full of love and kisses.',
    fileName: '31in1realgame-multicart.nes',
    name: '31 In 1 Real Game!',
    platform: 'nes',
  },
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
    desc: 'Action game.',
    fileName: 'dabg.nes',
    name: 'Double Action Blaster Guys',
    platform: 'nes',
  },
  {
    desc: "You're in a submarine, and you're hot on the trail of another enemy sub. It seems to be pulling away from you. The decision was made by your superior to launch Guidance System Magellan, the latest remote-controlled rocket technology in submarine warfare! Guide the weapon through seaweed to get 100 points and win the day! Use the D-Pad to move left or right. The game will speed up as you progress further. Good luck!",
    fileName: 'gsm.nes',
    name: 'GSM',
    platform: 'nes',
  },
  {
    desc: 'Your best friend has been kidnapped and taken to the top of the Mega Mountain. You must save him.',
    fileName: 'megamountain.nes',
    name: 'Mega Mountain',
    platform: 'nes',
  },
  {
    desc: 'Would you like to take care of a virtual cat on your NES? I bet you would, so here is something that will allow you to do that! Have tons of fun with your virtual NES cat as it sits and stares at you, its toy, and generally makes you feel... bored! So good luck having fun with your cat!',
    fileName: 'nintencattheparody.nes',
    name: 'Nintencat: The Parody',
    platform: 'nes',
  },
  {
    desc: `Amondus has big plans for the land of Prim and its inhabitants. In order to carry out his nefarious plot, he must force the local goblin population to serve him and work against his biggest threat, Hekl! Take control of Amondus, his familiar Charwit, and the leader of the gargoyles, General Rant. Capture goblins to build an army worthy of a tyrant, and force them to steal all of Hekl's spells and mystical abilities! Before this can be accomplished, you must face the champions of the Primwoods, including its grand protector, The Elderwood! Are you wicked enough to carry out these heinous atrocities? Can you be villainous and enslave a population of relatively peaceful goblins? Only you can answer these questions in The Rise of Amondus, an exciting and action-packed prequel to The Mad Wizard, and the second installment of The Candelabra Epic!`,
    fileName: 'riseofamondus.nes',
    name: 'Rise Of Amondus',
    platform: 'nes',
  },
  {
    desc: 'Sgt. Helmet Training Day is an action platformer by the Mojon Twins, who released this nice game first on the ZX Spectrum. And now here it is - for the 8-Bit NES!',
    fileName: 'sgthelmet.nes',
    name: 'Sgt. Helmet - Training Day',
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
    desc: 'Objective of this game is to move the boxes and make them explode. All of the boxes have numbers. If you move one other will also countdown. The black squares are the place where the bobms should explode!',
    fileName: 'bombx.bin',
    name: 'BombX',
    platform: 'genesis',
  },
  {
    desc: "The objective of the game is to avoid running into the enemies for as long as you can. One new enemy is spawned every five seconds. Use the d-pad to avoid enemies, and hold 'A' to move faster. Touch an enemy and it's game over!",
    fileName: 'errorrush.bin',
    name: 'Error Rush',
    platform: 'genesis',
  },
  {
    desc: 'Cheril finds herself trapped until the zombie situation is brought under control. Naturally, this involves Cheril cleaning up the zombie infested streets of the city by taking them out. While the walking dead should be directly avoided, Cheril can activate resonator devices that are randomly placed in and around the streets. The resonators activate a vibration that puts the zombies in a state of confusion, which gives Cheril the time to jump over them, making them disappear in a puff of smoke.',
    fileName: 'mega-cheril-perils.bin',
    name: 'Mega Cheril Perils',
    platform: 'genesis',
  },
  {
    desc: 'For years the scientists tolled to produce products and medicines that are now taken for granted. Then one by one the planets were overrun by MECHANAUTS and the scientists forced into slavery. Now the Mechanauts themselves are at war. Their armies are away, the occupied planets barely defended. NOW IT IS YOUR CHANCE ! Rescue all of the scientists from the planets. Some of the scientists may bring their latest project with them to aid you in your mission. GO! NOW IS TIME to RETURN TO GENESIS !',
    fileName: 'returntogenesis.bin',
    name: 'Return To Genesis',
    platform: 'genesis',
  },
  {
    desc: 'Will Rick Dangerous, intrepid Super Hero and part-time stamp collector, survive his first mission in the Aztec temple of the tribe? Should he do so, Rick will face new hazards in the Egyptian tomb and the enemy fortress.',
    fileName: 'rickdangerous.bin',
    name: 'Rick Dangerous',
    platform: 'genesis',
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
  {
    desc: 'Space impact clone for GBA. Game happens in the space, the user is given a space craft to fight the enemies and in the final of the level he faces the boss of the level.',
    fileName: 'impact.gba',
    name: 'Impact',
    platform: 'gba',
  },
  {
    desc: "Barnabe must retreive the great poem of his family 'THE BALLAD OF JUMPING BARNABE', which is lost in lots of locations. Using the D pad and A button, the idea is to reach the top of the both screens.",
    fileName: 'jumpingbarnabe.gba',
    name: 'Jumping Barnabe',
    platform: 'gba',
  },
  {
    desc: 'Conversion of an old Amiga and Atari ST classic shooter called Goldrunner.',
    fileName: 'goldrunner.gba',
    name: 'GOLDRUNNER',
    platform: 'gba',
  },
  {
    desc: "This game is inspired by William Gibson's Neuromancer book and it's sequels with a bit of influence from the likewise inspired RPG, Shadowrun. You play the role of a hacker in the future, a 'decker', jacking into the global computer network 'The Matrix' with a direct brain link that enables you to experience the computer network as a virtual reality.",
    fileName: 'matrixrunner.gba',
    name: 'Matrix Runner',
    platform: 'gba',
  },
  {
    desc: 'The goal in NINJA SACK is to defeat lots of Ninjas and gain points. A tiny fighting game.',
    fileName: 'ninjasack.gba',
    name: 'Ninja Sack',
    platform: 'gba',
  },
  {
    desc: 'Oh no! The tables have been turned on good old Pac. All of the ghosts have been covered in toxic pac-tar and are now after our ball shaped hero. Even though Pac is armed with teeth after a visit to the dentist, they serve him no purpose. There is no escape. See how long you can survive and try to set a high score. The only thing Pac is able to do to prolong his life is find the bottles of Pac Beer floating around in space. Each time a ghost hits pac, he loses 1 pac-health. Drinking a bottle of Pac-beer will restore 1 pac-health. In the event you need to make a quick escape there is also a warp bucket at the bottom middle of the screen that will use advanced pac teleport technology to warp you to one of the 4 corners of the screen. Use at your own risk.',
    fileName: 'pacrun.gba',
    name: 'Pac Run',
    platform: 'gba',
  },
  {
    desc: 'In the violent near future, there existed a war/thrash metal band CYBERPRIEST, whose music brought strength and hope to the hessians struggling from day to day. You are asked to assume the control of IAN on his journey to the unknown. As the game begins he is his usual self but an initiation and transformation into Agent form awaits..',
    fileName: 'metalwarrior4.gba',
    name: 'Metal Warrior 4',
    platform: 'gba',
  },

  {
    desc: 'Solid Asteroids style game for SNES.',
    fileName: 'astrohawk.smc',
    name: 'Astrohawk',
    platform: 'snes',
  },
  {
    desc: 'Homebrew vertical shooter game featuring bacon.',
    fileName: 'blt.sfc',
    name: 'BLT',
    platform: 'snes',
  },
  {
    desc: 'You control Hugz the polar bear, who must deliver buckets to the angry walruses roaming about. Pick up buckets with the A button and place them on the ground with the B button, so that walruses walk into them. But be careful - if you get hit by a walrus, you have to start over! Once a walrus reaches a bucket, it becomes pacified and disappears.',
    fileName: 'bucket.smc',
    name: 'Bucket',
    platform: 'snes',
  },
  {
    desc: 'RPG game with action/adventure elements. Characters in the game are anthropomorphic animals, like wolves and big cats. Alec and Lilac agree to return home in order to warn both the Palace and the population of Librefur of the impending invasion. But before they can even leave the capital of Fleckenstein, the four friends are all arrested and put in separate jails, knowing they will be publically executed on the very next morning for alleged high treason. Alec has to make a decision the world he knows depends upon-as do both his own life and the lives of all his friends ... ',
    fileName: 'furryrpg.sfc',
    name: 'Furry RPG',
    platform: 'snes',
  },
  {
    desc: 'She sets to find her sister, and attain revenge for her parents death, along with the future restoration of her kingdom. What will happen next?',
    fileName: 'hilda.sfc',
    name: 'Hilda',
    platform: 'snes',
  },
  {
    desc: 'A simple SNES horizontal shooter demo game. Controls: D-Pad - Move Ship; B - Shoot',
    fileName: 'horizontal-shooter.sfc',
    name: 'Horizontal Shooter',
    platform: 'snes',
  },
  {
    desc: 'A single-button game featuring a cat riding a rocket.',
    fileName: 'jetpilotrising.sfc',
    name: 'Jet Pilot Rising',
    platform: 'snes',
  },
  {
    desc: `The game is supposed to be a Jump'n'Run game, combining the gameplay of "Megaman" and "Super Mario"`,
    fileName: 'megafamilybros.smc',
    name: 'MEGA FAMILY BROS',
    platform: 'snes',
  },
  {
    desc: 'N-Warp Daisakusen is a deathmatch minigame for eight human players. Connect two Multitaps and eight joypads to your SNES, invite some friends and compete for the first place by beating and kicking the shit out of the other players.',
    fileName: 'nwarpdaisakusen.smc',
    name: 'N-Warp Daisakusen',
    platform: 'snes',
  },
  {
    desc: 'Uwol is the adaptation of Uwol Question Money on ZX Spectrum.',
    fileName: 'questformoney.sfc',
    name: 'Uwol, Quest For Money',
    platform: 'snes',
  },
  {
    desc: "Similar game to 'Exodus' game for NES. Exodus: The player controls the biblical figure Moses as he leads the Israelites to the promised land, meaning he goes through a labyrinth.",
    fileName: 'rockfall.smc',
    name: 'Rockfall',
    platform: 'snes',
  },
  {
    desc: "The object of the game is to move all three characters to the EXIT in each level. Each player has 2 limited special abilities that you may use to help advance through the level. The in-game status bar displays the name of each ability and how many times it can be used during that level.\nFor example, Apple's two abilities are CARDKEY and SCREAM. Using CARDKEY next to a door will cause it to open and detract one CARDKEY point (you need at least one point to open a door). Her SCREAM stuns nearby enemies for a short period of time.\nAll three players must be alive and to the exit to complete the level. If you get yourself stuck, press START to pause and then SELECT to restart the level.\nAfter you complete each level a 4 letter password is given to you so that you may resume the game using the Password option at the title screen, after your system has been shut off.",
    fileName: 'saf.smc',
    name: 'Skipp And Fr,iends: Unexpected Journey',
    platform: 'snes',
  },
  {
    desc: "This game is so much fun, wreck 'em all enemies in your way is so cool, the music is so great too.",
    fileName: 'superbossgaiden.sfc',
    name: 'Super Boss Gaiden',
    platform: 'snes',
  },
  {
    desc: "Tchou is a green ET with big ears. He wins a ship at the lottery and now explores the universe. But today, he enters the galaxy of the Orange Evil Octopus? The goal is to survive many waves of foe, each wave coming with is own trajectory, resistance and speed. After some waves (depending of the level you choose) you'll reach the Boss . Try to survive to him now.",
    fileName: 'tchouv2.smc',
    name: 'Tchou 2',
    platform: 'snes',
  },

  {
    desc: "Blastah is a small free GBC shoot'em up game. It is mostly a quick game comedy was done in a few hours to take a part in a small game competition was organised for hobby GBC programmers.",
    fileName: 'blastah.gb',
    name: 'Blastah',
    platform: 'gbc',
  },
  {
    desc: 'Arkanoid type of game for gameboy color.',
    fileName: 'brickster.gbc',
    name: 'Brickster',
    platform: 'gbc',
  },
  {
    desc: 'Here we have Burly Bear going around swiping at mean foxes, eating cookies, and moving from place to place once the foxes have been felled.',
    fileName: 'burly.gbc',
    name: 'Burly Bear vs. The Mean Foxes',
    platform: 'gbc',
  },
  {
    desc: 'Combat Soccer is an intense game that somewhat looks like soccer. You control the top player. Your goal is to score 20 points against the bottom player. To assist you in your game, you are provided with a Rubber Rocket Gun. The Rockets can reflect the soccer ball in the other direction and temporarily make you opponent stop moving. Have Fun!',
    fileName: 'combatsoccer.gbc',
    name: 'Combat Soccer',
    platform: 'gbc',
  },
  {
    desc: "This is a very simple puzzle game in which the objective is to create rows or columns of 3 or more of the same geometric form. Each row or column of 3 is worth 1 point, a line of 4 elements is considered to be 2 lines of 3 together, so it's worth 2 points, etc. If removing a line allows another one to be removed, the combo counter increases and the score of that removal is multiplied by it. The combo counter may increase up to 9. As soon as new geometric forms come into the screen from the top, or the chain stops, the combo counter will go back to 1.",
    fileName: 'geometrix.gbc',
    name: 'Geometrix',
    platform: 'gbc',
  },
  {
    desc: 'Takumi has to deliver Ramen! Take it from the restaurant and deliver it to the customers before times runs out! Beware of cyclists! Controls: Move: D-pad; Pick and leave Ramen: A; Change Song: Select',
    fileName: 'initiald.gbc',
    name: 'InitialD',
    platform: 'gbc',
  },
  {
    desc: "Card game.. D-pad: controls mouse pointer; A: Action button, select a card (dot shows which card is active) then move pointer to another card and press 'A' again to place the active card if the move is legal; B: Moves the card under the pointer to the goal piles if the move is legal; START: Pauses the game, and allows the player to change the game style (whether to draw 1 or 3 cards) SELECT+DOWN: Redeals the cards.",
    fileName: 'klondike.gbc',
    name: 'Klondike',
    platform: 'gbc',
  },
  {
    desc: 'Poke Da Mon is an action packed game of poking (!?) for the Nintendo Gameboy and Gameboy Color console. Armed with a razor sharp poking stick, your goal is to poke the computer controlled opponent as many times as possible in under 99 seconds. This may sound simple, but your not the only one who has a stick. :) Controls are Simple: Use the pad to move your character around. To deploy the poking stick, press the A button. To Pause the game press the Start button.',
    fileName: 'pokedamon.gbc',
    name: 'Poke Da Mon',
    platform: 'gbc',
  },
  {
    desc: "This is uCity (pronounced 'micro-city'), the open-source city-building game for Game Boy Color.",
    fileName: 'ucity.gbc',
    name: 'uCity',
    platform: 'gbc',
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
