# Arcade source records

Updated September 18, 2026 UTC. The catalog contains 262 entries in one library: 8 bundled open-source games, 15 games on existing GitHub Pages sites, 238 GameMonetize embeds, and the current developer edition of Snow Rider 3D. Hosting flags are internal metadata, not library sections.

## Bundled open-source games

2048, Hextris, Astray, Radius Raid, JavaScript Tetris, Snake, Match-3, and Bubble Shooter retain their source, license files, and attribution. Each `dist/games/<id>/attribution.json` records its upstream repository and revision; `ARCADE-NOTICES.md` describes modifications. These files remain the source of truth for licensing.

## Existing GitHub Pages games

The following repositories already had published Pages endpoints. This update links those endpoints without copying their game code into the arcade repository:

- [Slope](https://github.com/UBG10001/Slope-Game): game at `https://ubg10001.github.io/Slope-Game/`.
- [Tiny Fishing](https://github.com/UBG10001/TinyFishing): game at `https://ubg10001.github.io/TinyFishing/`.
- [Run 3](https://github.com/UBG10001/run3): game at `https://ubg10001.github.io/run3/`.
- [Flappy Bird Unity](https://github.com/UBG10001/flappyBird.github.io): game at `https://ubg10001.github.io/flappyBird.github.io/`.
- [Geometry Dash Scratch adaptation](https://github.com/UBG10001/GeometryDash): game at `https://ubg10001.github.io/GeometryDash/`. This is a Scratch adaptation.
- [Subway Runner WebGL](https://github.com/UBG10001/Subway-Surf): game at `https://ubg10001.github.io/Subway-Surf/`.
- [Subway Runner Classic](https://github.com/UBG10001/Surfers): game at `https://ubg10001.github.io/Surfers/game.html`. Both subway entries are independent runner games.
- [MinesweeperJS](https://github.com/finnor/MinesweeperJS): game at `https://finnor.github.io/MinesweeperJS/`.
- [90s Games](https://github.com/prateek121/90s-games): seven individual game pages for Asteroids, Frogger, Breakout, Pong, Sokoban, Space Invaders, and Vaporwave Escape under `https://prateek121.github.io/90s-games/games/`.

The original audit checked 16 Pages endpoints, including the Snow Rider endpoint since removed from the catalog. All returned successful responses, and source inspection found their game cores served from those sites. Slope and Tiny Fishing contain optional ad or analytics integrations; Run 3 includes optional community chat. Source inspection does not prove the complete set of runtime requests or full gameplay.

## Current Snow Rider 3D

[GameBiz](https://gamebiz.com/) links its current game at [gamebiz.com/snow-rider-3d](https://gamebiz.com/snow-rider-3d/) and separately identifies [Snow Rider 3D Nostalgia](https://gamebiz.com/games/snow-rider-3d/). The arcade uses the current developer endpoint, whose source declares `productVersion: "4.0"`. Its data and WebAssembly files returned HTTP 200 with last-modified dates of November 30, 2025. The page uses a responsive canvas and retains its developer attribution footer.

The current edition reached its title screen, tutorial, and a short run through the redesigned arcade iframe. Its menu labeled the selected mode "NEW VERSION - NORMAL MODE" and offered "SWITCH TO OLD VERSION". The run ended with score 1. This validates a sampled initial gameplay flow, not a full walkthrough or two-player mode.

The former [UBG10001/snowrider3D fork](https://github.com/UBG10001/snowrider3D) has a latest commit dated May 16, 2023. Its Pages endpoint, `https://ubg10001.github.io/snowrider3D/`, is historical provenance only and is no longer used by this catalog. The earlier observation of its start screen and 23 Pages resources applies only to that old copy.

[CrazyGames](https://www.crazygames.com/game/snow-rider-3d) lists a Unity 6 edition updated January 22, 2026. That platform's date is not assigned to the developer-hosted edition, and the arcade makes no universal newest-build claim. Current Snow Rider card art is linked directly from the developer's [poster](https://gamebiz.com/img/snow-rider-3d-poster.jpg).

## Publisher sources

[GameMonetize's RSS Builder](https://gamemonetize.com/rss-builder) provides a JSON/RSS feed for publisher websites. The 238 external game IDs, titles, categories, controls, embed URLs, tags, dimensions, and thumbnails were selected from its [official public feed](https://gamemonetize.com/rssfeed.php?format=json&category=All&type=html5&popularity=mostplayed&company=All&amount=All). Descriptions use short source excerpts capped at 20 words. These entries require publisher servers. Their branding and in-game advertising remain part of the supplied embeds.

The [GameDistribution Snow Rider page](https://gamedistribution.com/games/snow-rider-3d/) supplied the original Snow Rider listing and artwork, now replaced in the player and card by GameBiz's current edition and poster. Its old publisher fields remain as provenance. The [Y8 Slope page](https://www.y8.com/games/slope) identifies Y8 Studio and supplies the locally served Slope artwork; Slope's player uses the existing GitHub Pages copy.

The original catalog research checked 240 publisher game endpoints and 240 original thumbnail endpoints, with successful responses and no blocking frame headers. Snow Rider now uses GameBiz and Slope uses Pages. Historical research artifacts (`gamemonetize-raw.json`, `slope-y8.html`, `snow-rider-gd.html`, `gd-game-page.js`, `http-checks.json`, `failed-checks.json`, and `catalog-unverified.json`) are in the separate research workspace and are not deployed. Endpoint checks do not establish complete gameplay, licensing ownership, mobile support, or future availability.

## Artwork, fonts, and attribution

The SVG card illustrations in `dist/assets/cards/` are original artwork created for this arcade, not screenshots or official game art. Other card images retain their game or publisher attribution.

DM Sans and Space Grotesk were obtained from the primary [Google Fonts repository](https://github.com/google/fonts), under `ofl/dmsans` and `ofl/spacegrotesk`. Fonts and their SIL Open Font License notices are served from `dist/assets/fonts`; the arcade shell has no external font request.

Game names, artwork, and other third-party assets belong to their respective owners. The root MIT license covers the original arcade shell and does not relicense third-party games. The generated `dist/credits.html` links every game's source and all bundled license notices. No ratings, play counts, or download claims are fabricated.
