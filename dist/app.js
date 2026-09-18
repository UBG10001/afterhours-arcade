(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const read = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  let games = [], view = 'local', category = 'All', query = '', limit = 40, selected = null, loadTimer, toastTimer;
  const githubGame = game => !!game.local || !!game.githubHosted;
  const favorites = new Set(read('afterhours-favorites', []));
  let recent = read('afterhours-recent', []);
  const icons = { 'Arcade': '♧', 'Racing': '⚑', 'Action': 'ϟ', 'Puzzle': '◇', 'Sports': '◉', 'Adventure': '♧', 'Multiplayer': '♙', 'Casual': '✦', 'Shooting': '⌖', 'Strategy': '♜' };
  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  function notify(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').hidden = true, 2200); }
  function viewMatches(g) { return (view !== 'favorites' || favorites.has(g.id)) && (view !== 'recent' || recent.includes(g.id)) && (view !== 'local' || githubGame(g)) && (view !== 'external' || !githubGame(g)); }
  function filtered() {
    let list = games.filter(g => viewMatches(g) && (category === 'All' || g.category === category) && (!query || [g.title, g.category, ...(g.tags || [])].join(' ').toLowerCase().includes(query.toLowerCase())));
    if ($('sort').value === 'az') list.sort((a,b) => a.title.localeCompare(b.title));
    else if ($('sort').value === 'za') list.sort((a,b) => b.title.localeCompare(a.title));
    else if (view === 'recent') list.sort((a,b) => recent.indexOf(a.id) - recent.indexOf(b.id));
    return list;
  }
  function imageErrors(root) { root.querySelectorAll('img').forEach(img => img.addEventListener('error', () => { const parent = img.parentElement; parent.classList.add('no-image'); const label = document.createElement('span'); label.textContent = img.alt; parent.append(label); }, { once:true })); }
  function render() {
    const list = filtered(), shown = list.slice(0, limit);
    const cats = [...new Set(games.filter(viewMatches).map(g => g.category))].sort();
    const categoryKey = JSON.stringify(cats);
    if ($('category-tabs').dataset.categories !== categoryKey) {
      $('category-tabs').innerHTML = ['All', ...cats].map(c => `<button class="chip" data-category="${esc(c)}">${esc(c === 'All' ? 'All categories' : c)}</button>`).join('');
      $('category-tabs').dataset.categories = categoryKey;
    }
    document.querySelectorAll('#side-categories [data-category]').forEach(button => { button.hidden = !cats.includes(button.dataset.category); });
    const titles = { all:'All games', favorites:'Favorites', recent:'Recently played', local:'GitHub games', external:'External games' };
    $('view-title').firstChild.textContent = query ? 'Search results ' : category !== 'All' ? category + ' games ' : titles[view] + ' ';
    $('total-count').textContent = list.length;
    $('crumb').textContent = titles[view]; $('side-count').textContent = games.filter(githubGame).length; $('external-count').textContent = games.filter(g => !githubGame(g)).length; $('fav-count').textContent = games.filter(g => favorites.has(g.id)).length;
    $('featured').hidden = !['all','local'].includes(view) || !!query || category !== 'All';
    $('hosting-note').textContent = view === 'local' ? 'Game files hosted on GitHub Pages.' : view === 'external' ? 'These games need access to servers outside GitHub Pages.' : 'GitHub-hosted and external games are labeled on each card.';
    document.querySelectorAll('[data-view]').forEach(b => { b.classList.toggle('active', b.dataset.view === view); b.setAttribute('aria-pressed', b.dataset.view === view); });
    document.querySelectorAll('[data-category]').forEach(b => { b.classList.toggle('active', b.dataset.category === category); b.setAttribute('aria-pressed', b.dataset.category === category); });
    $('game-grid').innerHTML = shown.map(g => `<article class="game-card"><button class="card-open" data-play="${esc(g.id)}" aria-label="Play ${esc(g.title)}"><div class="card-image">${g.thumbnail ? `<img src="${esc(g.thumbnail)}" alt="${esc(g.title)}" loading="lazy" decoding="async">` : `<span class="no-image" style="height:100%">${esc(g.title)}</span>`}<div class="card-play"><span>▶</span></div><span class="card-badge${githubGame(g) ? '' : ' external-badge'}">${githubGame(g) ? 'GITHUB HOSTED' : 'EXTERNAL SERVER'}</span></div><h2>${esc(g.title)}</h2><div class="card-meta"><span>${esc(g.category)}</span><span class="dot">·</span><span>${githubGame(g) ? 'GitHub Pages' : esc(g.provider || 'Browser game')}</span></div></button><button class="card-favorite ${favorites.has(g.id) ? 'saved' : ''}" data-fav="${esc(g.id)}" aria-label="${favorites.has(g.id) ? 'Remove ' : 'Add '}${esc(g.title)} ${favorites.has(g.id) ? 'from' : 'to'} favorites" aria-pressed="${favorites.has(g.id)}">${favorites.has(g.id) ? '♥' : '♡'}</button></article>`).join('');
    imageErrors($('game-grid'));
    $('empty').hidden = !!list.length;
    $('empty-description').textContent = view === 'favorites' && !query ? 'Tap the heart on a game to save it here.' : view === 'recent' && !query ? 'Your recently played games will appear here.' : 'Try another name or category.';
    $('load-more').hidden = limit >= list.length; $('showing').textContent = list.length ? `${shown.length} of ${list.length} games` : '';
    $('result-status').textContent = `${list.length} games found.`;
  }
  function setView(next) { view = next; category = 'All'; limit = 40; query = ''; $('search').value = ''; render(); }
  function setCategory(next) { category = next; limit = 40; render(); }
  function favorite(id) { if (favorites.has(id)) favorites.delete(id); else favorites.add(id); write('afterhours-favorites', [...favorites]); render(); updatePlayerFav(); }
  function updatePlayerFav() { if (!selected) return; const saved = favorites.has(selected.id); $('player-fav').textContent = saved ? '♥' : '♡'; $('player-fav').style.color = saved ? 'var(--lime)' : ''; $('player-fav').setAttribute('aria-label', saved ? 'Remove from favorites' : 'Add to favorites'); $('player-fav').setAttribute('aria-pressed', String(saved)); }
  function gameUrl(game) { const url = new URL(game.embed || game.url, location.href); if (url.hostname === 'html5.gamedistribution.com') url.searchParams.set('gd_sdk_referrer_url', location.href.split('#')[0]); return url.href; }
  function fitGame() {
    const stage = $('game-stage'), frame = $('game-frame');
    if (selected?.fixedViewport) {
      const { width, height } = selected.fixedViewport;
      const scale = Math.min(stage.clientWidth / width, stage.clientHeight / height);
      frame.style.width = `${width}px`; frame.style.height = `${height}px`;
      frame.style.left = `${(stage.clientWidth - width * scale) / 2}px`;
      frame.style.top = `${(stage.clientHeight - height * scale) / 2}px`;
      frame.style.transform = `scale(${scale})`; frame.style.transformOrigin = 'top left';
      return;
    }
    frame.style.left = '0'; frame.style.top = '0';
    const minWidth = selected?.local ? selected.minimumWidth || 0 : 0;
    const scale = minWidth > stage.clientWidth ? stage.clientWidth / minWidth : 1;
    frame.style.width = scale < 1 ? `${minWidth}px` : '100%';
    frame.style.height = scale < 1 ? `${stage.clientHeight / scale}px` : '100%';
    frame.style.transform = scale < 1 ? `scale(${scale})` : '';
    frame.style.transformOrigin = 'top left';
  }
  new ResizeObserver(fitGame).observe($('game-stage'));
  function loadSelected() { $('loading').hidden = false; clearTimeout(loadTimer); fitGame(); $('game-frame').src = gameUrl(selected); loadTimer = setTimeout(() => { $('loading').hidden = true; }, 9000); }
  function play(id) {
    const game = games.find(g => g.id === id); if (!game) return;
    selected = game;
    $('player-title').textContent = game.title; $('player-category').textContent = game.category;
    $('instructions').textContent = game.instructions || 'Follow the controls shown inside the game.';
    $('description').textContent = game.description || '';
    $('open-original').href = gameUrl(game); $('game-provider').textContent = githubGame(game) ? 'Hosted on GitHub Pages' : `External server · ${game.provider || 'the game publisher'}`;
    $('game-frame').title = game.title;
    updatePlayerFav();
    recent = [id, ...recent.filter(item => item !== id)].slice(0, 40); write('afterhours-recent', recent);
    if (!$('player').open) $('player').showModal(); document.body.style.overflow = 'hidden';
    loadSelected(); render();
    history.replaceState(null, '', '#game=' + encodeURIComponent(id));
  }
  function closePlayer() { $('player').close(); }
  $('player').addEventListener('close', () => { $('game-frame').src = 'about:blank'; document.body.style.overflow = ''; clearTimeout(loadTimer); history.replaceState(null, '', location.pathname + location.search); selected = null; });
  $('game-frame').addEventListener('load', () => { $('loading').hidden = true; clearTimeout(loadTimer); });
  $('close-player').onclick = closePlayer;
  $('reload-game').onclick = () => { if (selected) loadSelected(); };
  $('player-fav').onclick = () => { if (selected) favorite(selected.id); };
  $('fullscreen').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await $('game-stage').requestFullscreen(); } catch { notify('Fullscreen is unavailable in this browser. Use Open game.'); } };
  $('player').addEventListener('click', e => { if (e.target === $('player')) { const r = $('player').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closePlayer(); } });
  document.addEventListener('click', e => { const target = e.target.closest('[data-play],[data-fav],[data-view],[data-category]'); if (!target) return; if (target.dataset.play) play(target.dataset.play); else if (target.dataset.fav) favorite(target.dataset.fav); else if (target.dataset.view) setView(target.dataset.view); else if (target.dataset.category) setCategory(target.dataset.category); });
  $('search').addEventListener('input', () => { query = $('search').value.trim(); limit = 40; render(); });
  $('sort').onchange = render;
  $('reset').onclick = () => setView('local');
  $('load-more').onclick = () => { const previous = limit; limit += 40; render(); $('game-grid').children[previous]?.querySelector('button')?.focus({ preventScroll:true }); };
  function random() { const candidates = filtered(); if (!candidates.length) return notify('No games in this selection.'); play(candidates[Math.floor(Math.random() * candidates.length)].id); }
  $('random').onclick = random; $('random-side').onclick = random;
  document.addEventListener('keydown', e => { if (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) && !$('player').open) { e.preventDefault(); $('search').focus(); } });
  async function init() {
    try {
      const response = await fetch('catalog.json'); if (!response.ok) throw new Error('Could not load game catalog'); games = await response.json();
      const cats = [...new Set(games.map(g => g.category))].sort();
      const sidebarCats = ['Arcade','Racing','Action','Puzzle','Sports','Adventure','Multiplayer','Shooting'];
      $('side-categories').innerHTML = sidebarCats.filter(c => cats.includes(c)).map(c => `<button class="category-nav" data-category="${esc(c)}"><span aria-hidden="true">${icons[c] || '◇'}</span>${esc(c)}</button>`).join('');
      const features = ['snow-rider-3d','slope','2048'].map(id => games.find(g => g.id === id && githubGame(g))).filter(Boolean);
      $('featured-grid').innerHTML = features.map((g,i) => `<button class="feature" data-play="${esc(g.id)}" aria-label="Play ${esc(g.title)}">${g.thumbnail ? `<img src="${esc(g.thumbnail)}" alt="${esc(g.title)}">` : ''}<span class="feature-tag">${['IN THE SPOTLIGHT','ONE MORE RUN','ARCADE ESSENTIAL'][i]}</span><div class="feature-content"><span class="feature-play">▶</span><span class="feature-meta">${esc(g.category)} · Instant play</span><h2>${esc(g.title)}</h2></div></button>`).join('');
      render();
      const requested = new URLSearchParams(location.hash.slice(1)).get('game'); if (requested) play(requested);
      if (window.self !== window.top) window.parent.postMessage({type:'afterhours:ready'}, location.origin);
      const context = document.modelContext;
      if (context?.registerTool) {
        try {
          await context.registerTool({ name:'search_arcade_games', description:'Search GitHub-hosted arcade games, or include external-server games when requested.', inputSchema:{type:'object',properties:{query:{type:'string'},includeExternal:{type:'boolean'}},required:['query'],additionalProperties:false}, annotations:{readOnlyHint:true}, execute(input) { if (typeof input?.query !== 'string' || (input.includeExternal !== undefined && typeof input.includeExternal !== 'boolean')) throw new Error('Expected a string query and optional boolean includeExternal'); setView(input.includeExternal ? 'all' : 'local'); query = input.query; $('search').value = query; render(); return filtered().map(g => ({id:g.id,title:g.title,category:g.category,githubHosted:githubGame(g),hostedHere:!!g.local})); } });
          await context.registerTool({ name:'open_arcade_game', description:'Open a game in the arcade player and record it in local recently played history.', inputSchema:{type:'object',properties:{id:{type:'string'}},required:['id'],additionalProperties:false}, annotations:{readOnlyHint:false}, execute(input) { if (typeof input?.id !== 'string' || !games.some(g => g.id === input.id)) throw new Error('Unknown game ID'); play(input.id); return {id:selected.id,title:selected.title,playerOpen:true}; } });
        } catch {}
      }
    } catch(error) { $('game-grid').innerHTML = '<p>Couldn’t load the games. Refresh the page to try again.</p>'; $('featured').hidden = true; }
  }
  if (window.afterhoursLauncherActive) window.addEventListener('afterhours:continue', init, {once:true});
  else init();
})();
