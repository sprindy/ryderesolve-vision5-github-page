(() => {
  const input = document.getElementById('backend-url');
  const status = document.getElementById('connection-status');
  const button = document.getElementById('connect-button');
  try { input.value = window.RYDE_DEPLOYMENT?.backendUrl || localStorage.getItem('rydeHostedBackend:v1') || ''; } catch {}
  document.getElementById('connection-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    let origin;
    try {
      const url = new URL(input.value.trim());
      if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !['', '/'].includes(url.pathname)) throw Error();
      origin = url.origin;
    } catch { status.textContent = 'Enter an HTTPS service origin without a path, credentials or query.'; return; }
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 90000);
    button.disabled = true;
    status.textContent = 'Checking Vision 5… A sleeping free service may need about a minute to wake up.';
    try {
      const response = await fetch(origin + '/api/health', {cache: 'no-store', signal: controller.signal});
      if (!response.ok) throw Error('Health endpoint returned HTTP ' + response.status + '.');
      const health = await response.json();
      if (!health.ok || !String(health.version).startsWith('vision5-') || !String(health.workflow).includes('LangGraph')) throw Error('This is not the expected Vision 5 backend.');
      const configured = window.RYDE_DEPLOYMENT?.backendUrl;
      if (configured && configured.replace(/\/$/, '') !== origin) throw Error('Update the fixed BACKEND_URL repository variable and redeploy to use this service.');
      localStorage.setItem('rydeHostedBackend:v1', origin);
      status.textContent = 'Connected. Opening Rider…'; window.location.assign('./rider.html');
    } catch (error) {
      status.textContent = error.name === 'AbortError' ? 'No response within 90 seconds. Check Render deployment status, then retry.' : 'Could not connect. Check the service URL, Render deploy status and CORS_ORIGINS=https://sprindy.github.io. ' + error.message;
    } finally { clearTimeout(timer); button.disabled = false; }
  });
})();
