const fs = require('fs');
let code = fs.readFileSync('src/context/ShopContext.tsx', 'utf8');

// Interface
code = code.replace(/  products: Product\[\];/, "  products: Product[];\n  allProducts: Product[];");

// State
code = code.replace(/  const \[products, setProducts\] = useState<Product\[\]>\(\[\]\);/, "  const [products, setProducts] = useState<Product[]>([]);\n  const [allProducts, setAllProducts] = useState<Product[]>([]);");

// Fetch mapping
code = code.replace(/          setProducts\(list\);/, "          setAllProducts(list);\n          setProducts(list.filter(p => p.isActive !== false));");

// Provider value
code = code.replace(/        products,/, "        products,\n        allProducts,");

// Update Products Admin page to use allProducts
let adminCode = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');
adminCode = adminCode.replace(/const \{ products, categories \} = useShop\(\);/, "const { allProducts: products, categories } = useShop();");
fs.writeFileSync('src/pages/admin/Products.tsx', adminCode);

// Update Dashboard Admin page to use allProducts
let dashCode = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');
dashCode = dashCode.replace(/const \{ products, categories, isSeeding, seedInitialDataIfEmpty \} = useShop\(\);/, "const { allProducts: products, categories, isSeeding, seedInitialDataIfEmpty } = useShop();");
fs.writeFileSync('src/pages/admin/Dashboard.tsx', dashCode);

fs.writeFileSync('src/context/ShopContext.tsx', code);
