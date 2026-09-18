(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const read = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const heart = saved => `<svg viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>`;
  const playIcon = '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m5 3 11 7-11 7Z"/></svg>';
  const favorites = new Set(read('afterhours-favorites', []));
  let recent = read('afterhours-recent', []);
  let games = [], view = 'all', category = 'All', query = '', limit = 42, selected = null, loadTimer, toastTimer;
  let lastOpener = null, lastOpenerGameId = null;
  const priority = ['snow-rider-3d','slope','run-3','tiny-fishing','geometry-dash-scratch','flappy-bird-unity','2048','subway-runner-webgl','hextris','subway-runner-classic','astray','radius-raid','tetris','snake','match-3','bubble-shooter','classic-breakout','classic-space-invaders','minesweeper-js','classic-pong','classic-frogger','classic-asteroids','classic-sokoban','classic-vaporwave-escape'];
  function notify(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').hidden = true, 2400); }
  function viewMatches(g) { return (view !== 'favorites' || favorites.has(g.id)) && (view !== 'recent' || recent.includes(g.id)); }
  function filtered() {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const list = games.filter(g => viewMatches(g) && (category === 'All' || g.category === category) && words.every(word => [g.title,g.category,...(g.tags || [])].join(' ').toLowerCase().includes(word)));
    if ($('sort').value === 'az') list.sort((a,b) => a.title.localeCompare(b.title));
    else if ($('sort').value === 'za') list.sort((a,b) => b.title.localeCompare(a.title));
    else if (view === 'recent') list.sort((a,b) => recent.indexOf(a.id) - recent.indexOf(b.id));
    return list;
  }
  function fallback(img) {
    if (img.parentElement.classList.contains('no-image')) return;
    img.parentElement.classList.add('no-image');
    const mark = document.createElement('span'); mark.className = 'fallback-symbol';
    mark.textContent = img.alt.split(/\s+/).slice(0,2).map(word => word[0]).join('');
    img.parentElement.append(mark);
  }
  function render() {
    const focusedFavorite = document.activeElement?.dataset.fav;
    const list = filtered(), shown = list.slice(0, limit);
    const cats = [...new Set(games.filter(viewMatches).map(g => g.category))].sort();
    const categoryKey = JSON.stringify(cats);
    if ($('category-tabs').dataset.categories !== categoryKey) {
      $('category-tabs').innerHTML = ['All', ...cats].map(c => `<button class="chip" data-category="${esc(c)}">${esc(c)}</button>`).join('');
      $('category-tabs').dataset.categories = categoryKey;
    }
    const titles = {all:'Games',favorites:'Favorites',recent:'Recently played'};
    $('view-title').textContent = query ? 'Search results' : category !== 'All' ? category : titles[view];
    $('total-count').textContent = list.length;
    const savedCount = games.filter(g => favorites.has(g.id)).length;
    $('fav-count').textContent = savedCount; $('fav-count').hidden = !savedCount;
    document.querySelectorAll('[data-view]').forEach(b => { const active = b.dataset.view === view; b.classList.toggle('active', active); b.setAttribute('aria-pressed', active); });
    document.querySelectorAll('[data-category]').forEach(b => { const active = b.dataset.category === category; b.classList.toggle('active', active); b.setAttribute('aria-pressed', active); });
    const home = view === 'all' && !query && category === 'All' && $('sort').value === 'featured';
    $('game-grid').innerHTML = shown.map(g => {
      const saved = favorites.has(g.id), hero = home && g.id === 'snow-rider-3d';
      return `<article class="game-card${hero ? ' hero-card' : ''}"><button class="card-open" data-play="${esc(g.id)}" aria-label="Play ${esc(g.title)}"><div class="card-image">${g.thumbnail ? `<img src="${esc(g.thumbnail)}" alt="${esc(g.title)}" loading="${hero ? 'eager' : 'lazy'}" decoding="async"${hero ? ' fetchpriority="high"' : ''}>` : `<span class="fallback-symbol">${esc(g.title.slice(0,2))}</span>`}</div><div class="card-content"><h2>${esc(g.title)}</h2><span class="play-mark">${playIcon}</span></div></button><button class="card-favorite${saved ? ' saved' : ''}" data-fav="${esc(g.id)}" aria-label="${saved ? 'Remove' : 'Add'} ${esc(g.title)} ${saved ? 'from' : 'to'} favorites" aria-pressed="${saved}" title="${saved ? 'Remove favorite' : 'Favorite'}">${heart(saved)}</button></article>`;
    }).join('');
    $('game-grid').setAttribute('aria-busy','false');
    $('game-grid').querySelectorAll('img').forEach(img => { img.addEventListener('error', () => fallback(img), {once:true}); if (img.complete && !img.naturalWidth) fallback(img); });
    $('empty').hidden = !!list.length;
    $('empty-description').textContent = view === 'favorites' && !query ? 'Tap a heart to keep a game here.' : view === 'recent' && !query ? 'Your last played games will appear here.' : 'Try a different name or category.';
    $('load-more').hidden = limit >= list.length;
    $('result-status').textContent = `${list.length} games found.`;
    if (focusedFavorite) [...document.querySelectorAll('[data-fav]')].find(b => b.dataset.fav === focusedFavorite)?.focus({preventScroll:true});
  }
  function setView(next) { view = next; category = 'All'; limit = 42; query = ''; $('search').value = ''; render(); }
  function setCategory(next) { category = next; limit = 42; render(); }
  function favorite(id) { if (favorites.has(id)) favorites.delete(id); else favorites.add(id); write('afterhours-favorites',[...favorites]); render(); updatePlayerFav(); }
  function updatePlayerFav() { if (!selected) return; const saved = favorites.has(selected.id); $('player-fav').innerHTML = heart(saved); $('player-fav').classList.toggle('saved',saved); $('player-fav').setAttribute('aria-label',saved ? 'Remove from favorites' : 'Add to favorites'); $('player-fav').setAttribute('aria-pressed',saved); }
  function gameUrl(game) { const url = new URL(game.embed,location.href); if (url.hostname === 'html5.gamedistribution.com') url.searchParams.set('gd_sdk_referrer_url',location.href); return url.href; }
  function fitGame() {
    const stage = $('game-stage'), frame = $('game-frame');
    if (!selected) return;
    if (selected.fixedViewport) {
      const {width,height} = selected.fixedViewport;
      const scale = Math.min(stage.clientWidth / width,stage.clientHeight / height);
      Object.assign(frame.style,{width:`${width}px`,height:`${height}px`,left:`${(stage.clientWidth - width * scale) / 2}px`,top:`${(stage.clientHeight - height * scale) / 2}px`,transform:`scale(${scale})`,transformOrigin:'top left'});
      return;
    }
    const minWidth = selected.local ? selected.minimumWidth || 0 : 0;
    const scale = minWidth > stage.clientWidth ? stage.clientWidth / minWidth : 1;
    Object.assign(frame.style,{left:'0',top:'0',width:scale < 1 ? `${minWidth}px` : '100%',height:scale < 1 ? `${stage.clientHeight / scale}px` : '100%',transform:scale < 1 ? `scale(${scale})` : '',transformOrigin:'top left'});
  }
  new ResizeObserver(fitGame).observe($('game-stage'));
  function loadSelected() {
    if (!selected) return;
    $('loading').hidden = false; $('slow-load').hidden = true;
    clearTimeout(loadTimer); fitGame(); $('game-frame').src = gameUrl(selected);
    loadTimer = setTimeout(() => { $('loading').hidden = true; $('slow-load').hidden = false; },20000);
  }
  function play(id) {
    const game = games.find(g => g.id === id); if (!game) return;
    if (!$('player').open) { lastOpener = document.activeElement; lastOpenerGameId = lastOpener?.dataset.play || null; }
    selected = game;
    $('player-title').textContent = game.title;
    $('instructions').textContent = game.instructions || 'Follow the controls shown in the game.';
    $('controls').open = false;
    $('open-original').href = gameUrl(game); $('slow-open').href = gameUrl(game);
    $('game-frame').title = game.title;
    updatePlayerFav();
    recent = [id,...recent.filter(item => item !== id)].slice(0,40); write('afterhours-recent',recent);
    if (!$('player').open) $('player').showModal(); document.body.style.overflow = 'hidden';
    render(); loadSelected(); history.replaceState(null,'','#game=' + encodeURIComponent(id));
  }
  async function closePlayer() { if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} } $('player').close(); }
  $('player').addEventListener('close',() => { $('game-frame').src = 'about:blank'; document.body.style.overflow = ''; clearTimeout(loadTimer); history.replaceState(null,'',location.pathname + location.search); selected = null; const opener = lastOpenerGameId ? [...document.querySelectorAll('[data-play]')].find(button => button.dataset.play === lastOpenerGameId) : lastOpener; if (opener?.isConnected) opener.focus({preventScroll:true}); else $('search').focus({preventScroll:true}); });
  $('game-frame').addEventListener('load',() => { if (!selected || $('game-frame').getAttribute('src') === 'about:blank') return; $('loading').hidden = true; $('slow-load').hidden = true; clearTimeout(loadTimer); });
  $('close-player').onclick = closePlayer;
  $('reload-game').onclick = loadSelected; $('retry-load').onclick = loadSelected;
  $('player-fav').onclick = () => { if (selected) favorite(selected.id); };
  $('fullscreen').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await $('game-stage').requestFullscreen(); } catch { notify('Use Open game for a larger window.'); } };
  document.addEventListener('fullscreenchange',fitGame);
  document.addEventListener('click',e => { const target = e.target.closest('[data-play],[data-fav],[data-view],[data-category]'); if (!target) return; if (target.dataset.play) play(target.dataset.play); else if (target.dataset.fav) favorite(target.dataset.fav); else if (target.dataset.view) setView(target.dataset.view); else if (target.dataset.category) setCategory(target.dataset.category); });
  $('search').addEventListener('input',() => { query = $('search').value.trim(); limit = 42; render(); });
  $('sort').onchange = render; $('reset').onclick = () => setView('all');
  $('load-more').onclick = () => { const previous = limit; limit += 42; render(); $('game-grid').children[previous]?.querySelector('button')?.focus({preventScroll:true}); };
  $('random').onclick = () => { const candidates = filtered(); if (!candidates.length) return notify('No games in this selection.'); play(candidates[Math.floor(Math.random() * candidates.length)].id); };
  document.addEventListener('keydown',e => { if (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) && !$('player').open) { e.preventDefault(); $('search').focus(); } });
  function openHash() { const id = new URLSearchParams(location.hash.slice(1)).get('game'); if (id && games.some(g => g.id === id)) play(id); else if ($('player').open) closePlayer(); }
  window.addEventListener('hashchange',openHash);
  async function init() {
    try {
      const response = await fetch('catalog.json?v=play-2'); if (!response.ok) throw new Error('Catalog unavailable');
      games = await response.json();
      const rank = new Map(priority.map((id,index) => [id,index]));
      games.sort((a,b) => (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999));
      render(); openHash();
      if (window.self !== window.top) window.parent.postMessage({type:'afterhours:ready'},location.origin);
      if (document.modelContext?.registerTool) {
        try {
          await document.modelContext.registerTool({name:'search_arcade_games',description:'Search the arcade by title, category, or keyword.',inputSchema:{type:'object',properties:{query:{type:'string'}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true},execute(input) { if (typeof input?.query !== 'string') throw new Error('Expected a search query'); setView('all'); query = input.query; $('search').value = query; render(); return filtered().map(g => ({id:g.id,title:g.title,category:g.category})); }});
          await document.modelContext.registerTool({name:'open_arcade_game',description:'Play a game and add it to recently played.',inputSchema:{type:'object',properties:{id:{type:'string'}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input) { if (typeof input?.id !== 'string' || !games.some(g => g.id === input.id)) throw new Error('Unknown game ID'); play(input.id); return {id:selected.id,title:selected.title,playerOpen:true}; }});
        } catch {}
      }
    } catch { $('game-grid').setAttribute('aria-busy','false'); $('game-grid').innerHTML = '<p class="load-error">Couldn’t load the games. Refresh to try again.</p>'; }
  }
  if (window.afterhoursLauncherActive) window.addEventListener('afterhours:continue',init,{once:true}); else init();
})();
