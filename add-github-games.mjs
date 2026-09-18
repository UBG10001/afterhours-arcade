import fs from 'node:fs';
const file=new URL('./dist/catalog.json',import.meta.url);
const games=JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
const additions=[
 {id:'tiny-fishing',title:'Tiny Fishing',category:'Casual',embed:'https://ubg10001.github.io/TinyFishing/',sourceUrl:'https://github.com/UBG10001/TinyFishing',thumbnail:'https://ubg10001.github.io/TinyFishing/html5game/bg.png',instructions:'Click or tap to cast, then move the hook to catch fish. Spend earnings on upgrades.',description:'Cast your line, collect fish, and upgrade your fishing gear.'},
 {id:'run-3',title:'Run 3',category:'Arcade',embed:'https://ubg10001.github.io/run3/',sourceUrl:'https://github.com/UBG10001/run3',thumbnail:'https://ubg10001.github.io/run3/favicon.png',instructions:'Use the arrow keys to move and Space or Up to jump. Run along tunnel walls to change gravity.',description:'Jump through space tunnels and keep clear of the gaps.'},
 {id:'flappy-bird-unity',title:'Flappy Bird (Unity)',category:'Arcade',embed:'https://ubg10001.github.io/flappyBird.github.io/',sourceUrl:'https://github.com/UBG10001/flappyBird.github.io',thumbnail:'',instructions:'Click, tap, or press Space to flap. Keep the bird between the pipes.',description:'A Unity version of the pipe-dodging arcade game.',fixedViewport:{width:960,height:645}},
 {id:'geometry-dash-scratch',title:'Geometry Dash (Scratch)',category:'Arcade',embed:'https://ubg10001.github.io/GeometryDash/',sourceUrl:'https://github.com/UBG10001/GeometryDash',thumbnail:'',instructions:'Click the green flag or play control, then use Space, the up arrow, or click to jump.',description:'A Scratch adaptation inspired by Geometry Dash.'},
 {id:'subway-runner-webgl',title:'Subway Runner (WebGL)',category:'Arcade',embed:'https://ubg10001.github.io/Subway-Surf/',sourceUrl:'https://github.com/UBG10001/Subway-Surf',thumbnail:'',instructions:'Follow the in-game keyboard controls to move, jump, and avoid obstacles.',description:'An independent WebGL runner through a subway setting.',fixedViewport:{width:1830,height:930}},
 {id:'subway-runner-classic',title:'Subway Runner Classic',category:'Arcade',embed:'https://ubg10001.github.io/Surfers/game.html',sourceUrl:'https://github.com/UBG10001/Surfers',thumbnail:'',instructions:'Use the arrow keys to move and follow the in-game jump controls.',description:'A second independent browser runner with a subway theme.'}
];
additions.push({id:'minesweeper-js',title:'Minesweeper',category:'Puzzle',embed:'https://finnor.github.io/MinesweeperJS/',sourceUrl:'https://github.com/finnor/MinesweeperJS',thumbnail:'',instructions:'Click to reveal a tile. Right-click to flag a suspected mine.',description:'Clear the board without uncovering a mine.'});
for(const [id,title,category,instructions,description] of [
 ['asteroids','Asteroids','Shooting','Arrow keys rotate and thrust. Space fires. H uses hyperspace; Enter restarts.','Pilot a ship through a field of asteroids.'],
 ['frogger','Frogger','Arcade','Use arrow keys to move. Space starts the game.','Cross busy roads and rivers to reach safety.'],
 ['breakout','Breakout','Arcade','Left and right move the paddle. Space launches the ball; P pauses.','Break the bricks and keep the ball in play.'],
 ['pong','Pong','Sports','W and S move the paddle. Space serves; P pauses. Select a mode in the game.','Play a classic paddle match against the computer or a friend.'],
 ['sokoban','Sokoban','Puzzle','Use the arrow keys to move and push boxes onto their marked targets.','Solve box-pushing puzzles with careful moves.'],
 ['space-invaders','Space Invaders','Shooting','Arrow keys move. Space fires, P pauses, and Enter restarts.','Defend the screen against waves of descending invaders.'],
 ['vaporwave-escape','Vaporwave Escape','Arcade','Use arrow keys or WASD to move. Collect shapes and avoid hazards.','Collect shapes while escaping colorful hazards.']
]) additions.push({id:`classic-${id}`,title,category,instructions,description,embed:`https://prateek121.github.io/90s-games/games/${id}.html`,sourceUrl:'https://github.com/prateek121/90s-games',thumbnail:''});
for(const g of additions) {
 g.githubHosted=true;g.provider='GitHub Pages';g.hostingNote='Game core is served by an existing GitHub Pages repository. Optional integrations may request external servers.';
 const existing=games.findIndex(x=>x.id===g.id);if(existing>=0)games[existing]=g;else games.splice(2,0,g);
}
const slope=games.find(g=>g.id==='slope');slope.thumbnail='assets/slope.webp';
fs.writeFileSync(file,JSON.stringify(games,null,2)+'\n');
console.log(`${games.length} games; ${games.filter(g=>g.local||g.githubHosted).length} GitHub-hosted.`);
