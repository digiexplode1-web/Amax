const fs = require('fs');

// Patch Categories
let catCode = fs.readFileSync('src/pages/admin/Categories.tsx', 'utf8');
catCode = catCode.replace(/const handleDelete = async \(id: string\) => {/, "const handleDelete = async (id: string) => {\n    if (!window.confirm('Are you sure you want to delete this category?')) return;");
fs.writeFileSync('src/pages/admin/Categories.tsx', catCode);

// Patch Products
let prodCode = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');
prodCode = prodCode.replace(/const handleDelete = async \(id: string\) => {/, "const handleDelete = async (id: string) => {\n    if (!window.confirm('Are you sure you want to delete this product?')) return;");
fs.writeFileSync('src/pages/admin/Products.tsx', prodCode);

