(() => {
  'use strict';
  // Embedded visits must never create another launcher.
  if (window.self !== window.top) return;

  window.afterhoursLauncherActive = true;
  document.documentElement.classList.add('launch-mode');
  const screen = document.createElement('main');
  screen.className = 'launch-screen';
  screen.innerHTML = '<section class="launch-card" aria-labelledby="launch-title"><span class="brand-mark" aria-hidden="true">ϟ</span><p class="eyebrow">AFTERHOURS ARCADE</p><h1 id="launch-title">Opening your arcade</h1><p id="launch-status" role="status" aria-live="polite">Your games will open in a new about:blank tab.</p><div class="launch-actions"><button class="primary" id="launch-open" type="button">Open arcade ↗</button><button class="secondary" id="launch-here" type="button">Play in this tab</button></div><p class="launch-note">The original tab will close if your browser allows it.</p></section>';
  document.body.append(screen);
  const title = screen.querySelector('#launch-title');
  const status = screen.querySelector('#launch-status');
  const openButton = screen.querySelector('#launch-open');
  const hereButton = screen.querySelector('#launch-here');
  let popup = null, frame = null, messageHandler = null, waitTimer, closeTimer;
  let ready = false, active = true;
  const targetUrl = location.href;
  const targetOrigin = location.origin;

  function cleanup() {
    clearTimeout(waitTimer); clearTimeout(closeTimer);
    if (popup && messageHandler) {
      try { popup.removeEventListener('message', messageHandler); } catch {}
    }
    messageHandler = null;
  }

  function finish() {
    if (!active || ready || !popup || popup.closed) return;
    ready = true;
    cleanup();
    title.textContent = 'Your arcade is open';
    status.textContent = 'You can switch to your new tab. If this tab stays open, close it manually.';
    openButton.textContent = 'Switch to arcade ↗';
    try { popup.focus(); } catch {}
    // Browsers decide whether this tab is script-closable. Do not work around that rule.
    closeTimer = setTimeout(() => { if (active && popup && !popup.closed) { try { window.close(); } catch {} } }, 150);
  }

  function openArcade() {
    if (!active) return;
    if (popup && !popup.closed) {
      try { popup.focus(); } catch {}
      return;
    }
    cleanup();
    ready = false;
    try { popup = window.open('about:blank', '_blank'); } catch { popup = null; }
    if (!popup) {
      title.textContent = 'Open your arcade';
      status.textContent = 'Your browser blocked the automatic pop-up. Click Open arcade to launch it.';
      openButton.textContent = 'Open arcade ↗';
      return;
    }
    try {
      const page = popup.document;
      page.title = 'Afterhours Arcade';
      page.documentElement.lang = 'en';
      const viewport = page.createElement('meta');
      viewport.name = 'viewport'; viewport.content = 'width=device-width,initial-scale=1';
      const style = page.createElement('style');
      style.textContent = 'html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#121417}iframe{display:block;width:100%;height:100%;border:0}';
      const icon = page.createElement('link');
      icon.rel = 'icon'; icon.href = document.querySelector('link[rel="icon"]').href;
      page.head.append(viewport, style, icon);
      frame = page.createElement('iframe');
      frame.title = 'Afterhours Arcade';
      frame.allow = 'autoplay; fullscreen; gamepad';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      messageHandler = event => {
        if (event.origin === targetOrigin && event.source === frame.contentWindow && event.data?.type === 'afterhours:ready') finish();
      };
      popup.addEventListener('message', messageHandler);
      frame.src = targetUrl;
      page.body.replaceChildren(frame);
      // Keep the new tab independent of its opener once it has been populated.
      popup.opener = null;
      title.textContent = 'Loading your new tab';
      status.textContent = 'The original tab will close after the arcade is ready, if your browser allows it.';
      openButton.textContent = 'Switch to arcade ↗';
      waitTimer = setTimeout(() => {
        if (!active || ready) return;
        title.textContent = 'Your new tab is taking a moment';
        status.textContent = 'Switch to the new tab, or play here if it did not load. This tab will stay open until the arcade is ready.';
      }, 12000);
      try { popup.focus(); } catch {}
    } catch {
      cleanup();
      try { popup.close(); } catch {}
      popup = null;
      title.textContent = 'Couldn’t open the arcade';
      status.textContent = 'Try Open arcade again, or play in this tab.';
      openButton.textContent = 'Open arcade ↗';
    }
  }

  openButton.addEventListener('click', openArcade);
  hereButton.addEventListener('click', () => {
    active = false;
    cleanup();
    try { if (popup && !popup.closed) popup.close(); } catch {}
    popup = null;
    window.afterhoursLauncherActive = false;
    document.documentElement.classList.remove('launch-mode');
    screen.remove();
    window.dispatchEvent(new Event('afterhours:continue'));
    document.querySelector('#search')?.focus();
  });
  openArcade();
})();
