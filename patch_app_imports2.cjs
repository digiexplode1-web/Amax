const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{ Settings as AdminSettings \} from '\.\/pages\/admin\/Settings';/, "import { Settings as AdminSettings } from './pages/admin/Settings';\nimport { HomepageEditor } from './pages/admin/HomepageEditor';\nimport { MediaLibrary, Orders, VisualEditor } from './pages/admin/DummyPages';");

fs.writeFileSync('src/App.tsx', code);
