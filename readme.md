<p align="center">
  <img src="public/assets/logo/logo-512x512.png" alt="logo" width="100" height="100">
  <h1 align="center">RetroAssembly</h1>
</p>

[RetroAssembly](https://retroassembly.com/) is a personal retro game collection cabinet in your browser.

![library](public/assets/screenshots/library.jpeg)

## Features

- [x] Relive memories from numerous retro gaming consoles in the browser. NES, SNES, Genesis, GameBoy, Arcade... See [Supported Platforms](#supported-platforms) below.
- [x] See your game collection displayed with auto-detected beautiful box arts and covers.
- [x] Save and synchronize your game at any point and resume later.
- [x] Made a mistake? Some emulators allow you to rewind gameplay.
- [x] Browse through platforms and your game library with an intuitive interface with [spatial navigation
](https://en.wikipedia.org/wiki/Spatial_navigation), which means you can just use a keyboard or a gamepad to navigate between games.
- [x] Enhance your gaming experience with beautiful visual effects with retro-style shaders.
- [x] Play on the go, even without a physical gamepad, using our on-screen virtual controller.

Share your thoughts or ideas to our [community](#Community) and they may appear here later :)

## Getting Started
1. *(Optional)* Join our Discord server.

   [![Join our Discord server!](https://invidget.switchblade.xyz/gwaKRAYG6t?theme=light)](https://discord.gg/gwaKRAYG6t)
2. Visit the [RetroAssembly website (retroassembly.com)](https://retroassembly.com/) in your web browser.
3. *(Optional)* If you're new here, explore the library and try out the available [demo games](https://retroassembly.com/demo) to see how it works.
4. [Login](https://retroassembly.com/login) and create your personal game library by uploading your own ROM files.
5. Once your ROMs are uploaded, select any game from your library to launch it directly in your browser and start playing.
6. Don't forget to use the in-game menu to save your progress, which will be synchronized for you.

## Community

+ Discord Server

  [![Discord](https://img.shields.io/discord/1129062038543548496?logo=discord)](https://discord.gg/gwaKRAYG6t)

+ GitHub discussions

  [![GitHub discussions](https://img.shields.io/github/discussions/arianrhodsandlot/retroassembly?logo=github)](https://github.com/arianrhodsandlot/retroassembly/discussions)

## Supported Platforms

RetroAssembly aims to support a wide range of vintage gaming systems. The emulation is powered by [Nostalgist.js](https://nostalgist.js.org/).

<details>
  <summary>Click here to view the comprehensive list.</summary>

  | Console | Available Emulators |
  | - | - |
  | Arcade | `mame2003_plus` |
  | Atari 2600 | `stella2014` |
  | Game Boy | `mgba`, `gearboy`, `gambatte`, `tgbdual` |
  | Game Boy Advance | `mgba`, `vba_next` |
  | Game Boy Color | `mgba`, `gearboy`, `gambatte`, `tgbdual` |
  | Game Gear | `genesis_plus_gx`, `gearsystem` |
  | Genesis / Megadrive | `genesis_plus_gx` |
  | Master System | `genesis_plus_gx`, `picodrive`, `gearsystem` |
  | Neo Geo Pocket | `mednafen_ngp` |
  | Neo Geo Pocket Color | `mednafen_ngp` |
  | NES / Family Computer | `fceumm`, `nestopia`, `quicknes` |
  | Sega SG-1000 | `gearsystem` |
  | Super Famicom / Super NES  | `snes9x`, `snes9x2002`, `snes9x2005`, `snes9x2010` |
  | Virtual Boy | `mednafen_vb` |
  | WonderSwan | `mednafen_wswan` |
  | WonderSwan Color | `mednafen_wswan` |

</details>

## Development
> [!warning]
> This section is not yet finished.

Technically, RetroAssembly is a React Router application deployed to Cloudflare workers. The development environment is a bit complex to setup now. We are going to simplify the setup process and complete this section in the future.

## Open-source Alternatives
We hope you have a fantastic time revisiting your favorite retro games... Even with applications other than RetroAssembly.

+ [EmulatorJS](https://emulatorjs.org) [:octocat:](https://github.com/EmulatorJS/EmulatorJS)
+ [GamePlayColor](https://gameplaycolor.com) [:octocat:](https://github.com/gameplaycolor/gameplaycolor)
+ [Gaseous](https://github.com/gaseous-project/gaseous-server)
+ [RetroArch Web Player](https://web.libretro.com) [:octocat:](https://github.com/libretro/RetroArch/tree/master/pkg/emscripten)
+ [RomM](https://romm.app/) [:octocat:](https://github.com/rommapp/romm)
+ [vme](https://gitgalu.github.io/vme/) [:octocat:](https://github.com/gitGalu/vme)
+ [webrcade](https://www.webrcade.com) [:octocat:](https://github.com/webrcade/webrcade)
+ [webretro](https://binbashbanana.github.io/webretro/) [:octocat:](https://github.com/BinBashBanana/webretro)

## License
[MIT](license)
