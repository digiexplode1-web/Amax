const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

// Add isActive state
code = code.replace(/  const \[isWeddingEssential, setIsWeddingEssential\] = useState\(false\);/, "  const [isWeddingEssential, setIsWeddingEssential] = useState(false);\n  const [isActive, setIsActive] = useState(true);");

// Reset state
code = code.replace(/    setIsWeddingEssential\(false\);/, "    setIsWeddingEssential(false);\n    setIsActive(true);");

// Set state on edit
code = code.replace(/    setIsWeddingEssential\(Boolean\(p.isWeddingEssential\)\);/, "    setIsWeddingEssential(Boolean(p.isWeddingEssential));\n    setIsActive(Boolean(p.isActive));");

// Include in save
code = code.replace(/        isWeddingEssential,/, "        isWeddingEssential,\n        isActive,");

// Add UI toggle for active status
const activeToggleCode = `
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-gray-300 text-[#C7953E] focus:ring-[#C7953E]" />
                    <span className="text-sm font-medium text-[#25201E]">Published (Visible on site)</span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6">If unchecked, this product will be saved as a Draft.</p>
                </div>
`;
code = code.replace(/                \{editingProduct && \(/, activeToggleCode + "\n                {editingProduct && (");

// Show draft badge
const badgeCode = `
                            <div className="font-medium text-[#25201E] flex items-center gap-2">
                              {p.name}
                              {!p.isActive && <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-[10px] font-bold">DRAFT</span>}
                            </div>
`;
code = code.replace(/                            <div className="font-medium text-\\[#25201E\\]">\{p.name\}<\/div>/, badgeCode);

// Filter shop products by isActive
fs.writeFileSync('src/pages/admin/Products.tsx', code);
