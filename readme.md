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

### Choose Your Setup
You have two options to get started with RetroAssembly:

#### Option 1: Use the Official Hosted Version

> [!tip]
> + This option is recommended for most users.
> + Perfect if you want to get started quickly without any setup.

1. Visit the [RetroAssembly website (retroassembly.com)](https://retroassembly.com/) in your web browser.
2. *(Optional)* If you're new here, explore the library and try out the available [demo games](https://retroassembly.com/demo) to see how it works.
3. [Login](https://retroassembly.com/login) and create your personal game library by uploading your own ROM files.
4. Once your ROMs are uploaded, select any game from your library to launch it directly in your browser and start playing.
5. Don't forget to use the in-game menu to save your progress, which will be synchronized for you.

#### Option 2: Self-Host with Docker

> [!tip]
> + This option is for advanced users who want full control.
> + Perfect if you prefer to host your own instance, have privacy concerns, or want to customize the deployment.

1. Make sure you have Docker installed on your system.
2. Pull and run the [RetroAssembly Docker image](https://hub.docker.com/r/arianrhodsandlot/retroassembly):
    ```sh
    docker run -d --name retroassembly -p 8000:8000 -v /path/to/your/data:/app/data arianrhodsandlot/retroassembly
    ```
    Replace `/path/to/your/data` with the actual path where you want to store your game data, ROMs, and save states. For example:
    ```sh
    docker run -d --name retroassembly -p 8000:8000 -v /srv/retroassembly:/app/data arianrhodsandlot/retroassembly
    ```
    You can also change the port `8000` to any other value you want.
3. Open your browser and navigate to `http://yourhost:8000` (if the port `8000` is used in previous step) to access your self-hosted RetroAssembly instance.
4. Create an account after clicking the "Library" button.
5. Upload your ROM files and start gaming!

## Community

+ Discord Server

  [![Discord](https://img.shields.io/discord/1129062038543548496?logo=discord)](https://discord.gg/gwaKRAYG6t)

+ GitHub discussions

  [![GitHub discussions](https://img.shields.io/github/discussions/arianrhodsandlot/retroassembly?logo=github)](https://github.com/arianrhodsandlot/retroassembly/discussions)

## Supported Platforms

RetroAssembly aims to support a wide range of vintage gaming systems. Emulation is powered by [Nostalgist.js](https://nostalgist.js.org/).

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
### Prerequisites
Make sure you have these softwares installed or activated.
| Dependences | Version |
| - | - |
| Node.js | `>=24` |
| PNPM | `>=10` |

### Steps
Simply run following commands in a terminal then a development server will be launched.
1. Install Node.js packages
    ```sh
    pnpm i
    ```
2. Setup development environment
    ```sh
    node --run=setup
    ```
3. Run development server
    ```sh
    node --run=dev
    ```

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
