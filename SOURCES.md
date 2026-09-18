# Arcade catalogue source records

Catalogue assembled on 2026-09-18 UTC. `catalog.json` contains 240 distinct games: 238 from GameMonetize, Snow Rider 3D from GameDistribution, and Slope from Y8. All 240 game endpoints and all 240 thumbnail URLs returned HTTP 200 or 206 during the recorded check. These are endpoint checks, not 240 gameplay walkthroughs.

## Public distribution sources

- GameMonetize's [RSS Builder](https://gamemonetize.com/rss-builder) explicitly offers a JSON/RSS game feed for adding games to publishers' websites. The game IDs, titles, categories, instructions, embed URLs, tags, dimensions, and thumbnails were obtained from its [official public feed](https://gamemonetize.com/rssfeed.php?format=json&category=All&type=html5&popularity=mostplayed&company=All&amount=All). The original feed is saved as `gamemonetize-raw.json`. This feed contains 5,001 entries; the catalogue selects 238 of them across categories. Descriptions in the catalogue are short source excerpts capped at 20 words. Some excerpts end with an ellipsis. Broadly recognizable franchise copies were excluded by a title filter, but no independent chain-of-title audit is represented.
- Y8's [Slope page](https://www.y8.com/games/slope) provides an explicit "Add this game to your web page" section with the exact iframe `https://y8.com/embed/slope`. The game page identifies Y8 Studio, specifies the controls, and contains the supplied thumbnail as `og:image`. The original HTML is saved as `slope-y8.html`; the embed appears near line 2685. Y8 also lists Slope in its games-for-your-website catalogue.
- GameDistribution's [Snow Rider 3D page](https://gamedistribution.com/games/snow-rider-3d/) embeds official JSON metadata identifying GameBiz, game hash `3b79a8537ebc414fb4f9672a9b8c68c8`, controls, dimensions, and exact image filenames. Its public page JavaScript constructs the HTML5 embed URL from that hash and thumbnail URLs from its own image host. Both are saved (`snow-rider-gd.html`, `gd-game-page.js`). The official [publisher article](https://blog.gamedistribution.com/the-best-online-family-christmas-games/) also recommends Snow Rider 3D for publisher integration.

## Required integration detail

For entries where `requiresReferrer` is true (Snow Rider 3D), append the query parameter `gd_sdk_referrer_url` with the exact, current arcade game page URL. For example, set it through `URL.searchParams.set('gd_sdk_referrer_url', window.location.href)` before assigning the iframe URL. Do not substitute the GameDistribution source page as a production referrer. The official GameDistribution page documents this requirement.

Use the supplied publisher embed. Do not copy or rehost the underlying proprietary game files, remove advertising, change the developer branding, or imply ownership. Publisher availability, ad behavior, regional access and mobile compatibility can change. Provide an external play fallback. No account was created and no agreement was signed as part of this research.

GameMonetize `sourcePage` is the feed builder, and `sourceUrl` is the exact feed proving the entry. Individual game page URLs were not invented. `externalUrl` opens the publisher-provided playable endpoint for these entries. Slope and Snow Rider use their official game pages as external links.

## Verification files

- `catalog.json`: final 240 game records, all URLs checked successfully.
- `http-checks.json`: 480 checks containing URL, final URL, HTTP status, content type, frame headers, and bytes read. None of the checked responses included a blocking X-Frame-Options or Content-Security-Policy header.
- `failed-checks.json`: empty array; no failures.
- `catalog-unverified.json`: initial copy, same 240 selections.

The checks verify that an endpoint returned content and its thumbnail was available. A publisher preload screen, consent choice, ad availability, browser support or later runtime error can still affect gameplay. The UI should not claim that every game was manually played.

## Suggested on-site attribution

Games are provided by their respective developers and publishers through GameMonetize, GameDistribution and Y8. All game names, artwork and other assets belong to their respective owners. Publisher branding and in-game ads remain part of the supplied games.

Show each game's `provider` next to a link to its `sourceUrl` or `sourcePage`. No fabricated ratings, play counts or download claims are included.
