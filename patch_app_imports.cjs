const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { HomepageEditor }')) {
  code = code.replace(/import { AdminSettings } from '\.\/pages\/admin\/Settings';/, "import { AdminSettings } from './pages/admin/Settings';\nimport { HomepageEditor } from './pages/admin/HomepageEditor';\nimport { MediaLibrary, Orders, VisualEditor } from './pages/admin/DummyPages';");
}
fs.writeFileSync('src/App.tsx', code);

let enq = fs.readFileSync('src/pages/admin/Enquiries.tsx', 'utf8');
enq = enq.replace(/import { MessageSquare, Search, Filter, Trash2 } from 'lucide-react';/, "import { MessageSquare, Search, Filter, Trash2, MoreVertical } from 'lucide-react';");
fs.writeFileSync('src/pages/admin/Enquiries.tsx', enq);

let homeEd = fs.readFileSync('src/pages/admin/HomepageEditor.tsx', 'utf8');
homeEd = homeEd.replace(/import { Save, Image as ImageIcon, CheckCircle, LayoutTemplate } from 'lucide-react';/, "import { Save, Image as ImageIcon, CheckCircle, LayoutTemplate, RefreshCw } from 'lucide-react';");
fs.writeFileSync('src/pages/admin/HomepageEditor.tsx', homeEd);
