const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importCode = `import { MediaLibrary, Orders, VisualEditor } from './pages/admin/DummyPages';`;
code = code.replace(/import \{ HomepageEditor \} from '.\/pages\/admin\/HomepageEditor';/, "import { HomepageEditor } from './pages/admin/HomepageEditor';\n" + importCode);

const routeCode = `              <Route path="editor" element={<VisualEditor />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="orders" element={<Orders />} />`;

code = code.replace(/<Route path="homepage" element={<HomepageEditor \/>} \/>/, "<Route path=\"homepage\" element={<HomepageEditor />} />\n" + routeCode);

fs.writeFileSync('src/App.tsx', code);
