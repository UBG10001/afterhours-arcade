# Arcade source records

Updated September 18, 2026 UTC. The current catalog contains 262 entries: 8 bundled open-source games, 16 games on existing GitHub Pages sites, and 238 external GameMonetize embeds. GitHub games are the default library.

## Bundled open-source games

2048, Hextris, Astray, Radius Raid, JavaScript Tetris, Snake, Match-3, and Bubble Shooter retain their source, license files, and attribution. Each `dist/games/<id>/attribution.json` records its upstream repository and revision; `ARCADE-NOTICES.md` describes modifications. These files remain the source of truth for licensing.

## Existing GitHub Pages games

The following repositories already had published Pages endpoints. This update links those endpoints without copying their game code into the arcade repository:

- [Snow Rider 3D](https://github.com/UBG10001/snowrider3D): game at `https://ubg10001.github.io/snowrider3D/`.
- [Slope](https://github.com/UBG10001/Slope-Game): game at `https://ubg10001.github.io/Slope-Game/`.
- [Tiny Fishing](https://github.com/UBG10001/TinyFishing): game at `https://ubg10001.github.io/TinyFishing/`.
- [Run 3](https://github.com/UBG10001/run3): game at `https://ubg10001.github.io/run3/`.
- [Flappy Bird Unity](https://github.com/UBG10001/flappyBird.github.io): game at `https://ubg10001.github.io/flappyBird.github.io/`.
- [Geometry Dash Scratch adaptation](https://github.com/UBG10001/GeometryDash): game at `https://ubg10001.github.io/GeometryDash/`. This is a Scratch adaptation.
- [Subway Runner WebGL](https://github.com/UBG10001/Subway-Surf): game at `https://ubg10001.github.io/Subway-Surf/`.
- [Subway Runner Classic](https://github.com/UBG10001/Surfers): game at `https://ubg10001.github.io/Surfers/game.html`. Both subway entries are independent runner games.
- [MinesweeperJS](https://github.com/finnor/MinesweeperJS): game at `https://finnor.github.io/MinesweeperJS/`.
- [90s Games](https://github.com/prateek121/90s-games): seven individual game pages for Asteroids, Frogger, Breakout, Pong, Sokoban, Space Invaders, and Vaporwave Escape under `https://prateek121.github.io/90s-games/games/`.

All 16 selected Pages endpoints returned successful responses. Source inspection found their game cores served from the Pages sites. Slope and Tiny Fishing contain optional ad or analytics integrations; Run 3 includes optional community chat. Source inspection alone cannot prove the complete set of runtime requests. Snow Rider reached its start screen in a browser with all 23 resources observed in that test coming from `ubg10001.github.io`. This is a sampled initial-load check, not a guarantee of access through filtering or a full walkthrough of all games.

## Publisher sources

[GameMonetize's RSS Builder](https://gamemonetize.com/rss-builder) provides a JSON/RSS feed for publisher websites. The 238 external game IDs, titles, categories, controls, embed URLs, tags, dimensions, and thumbnails were selected from its [official public feed](https://gamemonetize.com/rssfeed.php?format=json&category=All&type=html5&popularity=mostplayed&company=All&amount=All). Descriptions use short source excerpts capped at 20 words. These entries require publisher servers. Their branding and in-game advertising remain part of the supplied embeds.

The [GameDistribution Snow Rider page](https://gamedistribution.com/games/snow-rider-3d/) identifies GameBiz and supplies the Snow Rider artwork. The [Y8 Slope page](https://www.y8.com/games/slope) identifies Y8 Studio and supplies the Slope artwork. Those two featured thumbnails are now served locally. Their original publisher source and playable endpoints remain in `publisherSourceUrl` and `publisherEmbed` as provenance; the arcade player uses their GitHub Pages URLs.

The original catalog research checked 240 publisher game endpoints and 240 original thumbnail endpoints, with successful responses and no blocking frame headers. Snow Rider and Slope have since switched to Pages. Historical research artifacts (`gamemonetize-raw.json`, `slope-y8.html`, `snow-rider-gd.html`, `gd-game-page.js`, `http-checks.json`, `failed-checks.json`, and `catalog-unverified.json`) are in the separate research workspace and are not deployed. Endpoint checks do not establish complete gameplay, licensing ownership, mobile support, or future availability.

## Fonts and attribution

DM Sans and Space Grotesk were obtained from the primary [Google Fonts repository](https://github.com/google/fonts), under `ofl/dmsans` and `ofl/spacegrotesk`. Fonts and their SIL Open Font License notices are served from `dist/assets/fonts`; the arcade shell has no external font request.

Game names, artwork, and other third-party assets belong to their respective owners. The root MIT license covers the original arcade shell and does not relicense third-party games. The generated `dist/credits.html` links every game's source and all bundled license notices. No ratings, play counts, or download claims are fabricated.
