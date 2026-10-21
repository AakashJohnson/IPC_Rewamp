// Static hosts serve 404.html for unknown paths; making it the app shell lets deep links resolve client-side.
import fs from 'node:fs';

fs.copyFileSync('dist/index.html', 'dist/404.html');
console.log('postbuild: dist/404.html written');
