// Public backend URLs only. Model keys stay on the Python server.
(() => {
  const onPages = window.location.hostname.endsWith('.github.io');
  let saved = '';
  try { saved = localStorage.getItem('rydeHostedBackend:v1') || ''; } catch {}
  const configured = window.RYDE_DEPLOYMENT?.backendUrl || '';
  const backend = onPages ? (configured || saved) : (window.location.port === '5173' ? 'http://127.0.0.1:8000' : '');
  window.RYDE_CONFIG = {apiBase: backend.replace(/\/$/, ''), hosted: onPages};
  if (onPages && !backend && !window.location.pathname.endsWith('/connect.html')) {
    window.location.replace(new URL('./connect.html', window.location.href).href);
  }
  window.addEventListener('DOMContentLoaded', () => {
    if (window.location.protocol === 'file:') {
      const notice = document.getElementById('notice');
      if (notice) { notice.hidden = false; notice.className = 'notice error'; notice.textContent = 'Start the backend and open http://127.0.0.1:8000/rider, or use the hosted GitHub Pages demo.'; }
    }
    if (onPages && backend) {
      const banner = document.createElement('div');
      banner.style.cssText = 'padding:9px 20px;background:#edf4ee;color:#526d5c;font:12px sans-serif;text-align:center';
      banner.append('Hosted demo · synthetic trips · ');
      const link = document.createElement('a'); link.href = './connect.html'; link.textContent = 'Backend connection';
      banner.append(link); document.body.prepend(banner);
    }
  });
})();
