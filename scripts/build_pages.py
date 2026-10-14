"""Package static frontend only; no backend, keys or runtime records."""
import json
import os
import shutil
from pathlib import Path
from urllib.parse import urlsplit

root = Path(__file__).resolve().parents[1]
backend = os.getenv('BACKEND_URL', '').strip().rstrip('/')
if backend:
    url = urlsplit(backend)
    if url.scheme != 'https' or not url.hostname or url.username or url.password or url.path or url.query or url.fragment:
        raise SystemExit('BACKEND_URL must be an HTTPS origin without a path or credentials.')
output = root / '_site'
output.mkdir(exist_ok=True)
shutil.copytree(root / 'frontend', output, dirs_exist_ok=True)
(output / 'deployment-config.js').write_text('window.RYDE_DEPLOYMENT = ' + json.dumps({'backendUrl': backend}) + ';\n', encoding='utf-8')
(output / '.nojekyll').touch()
print('Packaged frontend. Backend URL ' + ('configured.' if backend else 'will be selected on the connection page.'))
