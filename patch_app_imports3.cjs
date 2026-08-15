const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/import \{ MediaLibrary, Orders, VisualEditor \} from '\.\/pages\/admin\/DummyPages';/, "import { MediaLibrary, Orders as AdminOrders, VisualEditor } from './pages/admin/DummyPages';");
code = code.replace(/<Route path="orders" element={<Orders \/>} \/>/, '<Route path="orders" element={<AdminOrders />} />');
fs.writeFileSync('src/App.tsx', code);
