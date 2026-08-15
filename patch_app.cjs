const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
code = code.replace(/import { AdminSettings } from '\.\/pages\/admin\/AdminSettings';/, "import { AdminSettings } from './pages/admin/AdminSettings';\nimport { HomepageEditor } from './pages/admin/HomepageEditor';");

// Add route
code = code.replace(/<Route path="settings" element={<AdminSettings \/>} \/>/, `<Route path="settings" element={<AdminSettings />} />\n              <Route path="homepage" element={<HomepageEditor />} />`);

fs.writeFileSync('src/App.tsx', code);
