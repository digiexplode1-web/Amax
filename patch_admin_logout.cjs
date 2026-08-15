const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminLayout.tsx', 'utf8');

const logoutCode = `
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={() => {
                localStorage.removeItem('amax_admin_auth');
                window.location.reload();
              }}
              className="flex items-center gap-3 px-3 py-2 text-[#F4E3DD]/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
`;

code = code.replace(/          <div className="absolute bottom-4 left-4 right-4">[\s\S]*?<\/div>\n        <\/div>\n\n        \{\/\* Main Content \*\/\}/, logoutCode + '\n        </div>\n\n        {/* Main Content */}');

fs.writeFileSync('src/pages/admin/AdminLayout.tsx', code);
