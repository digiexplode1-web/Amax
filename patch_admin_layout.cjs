const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminLayout.tsx', 'utf8');

code = code.replace(/import { LayoutDashboard, Package, Tags, Settings, MessageSquare, Menu, X, LogOut, ExternalLink, ShieldAlert } from 'lucide-react';/,
  "import { LayoutDashboard, Package, Tags, Settings, MessageSquare, Menu, X, LogOut, ExternalLink, ShieldAlert, LayoutTemplate } from 'lucide-react';");

code = code.replace(/    { name: 'Products', path: '\/admin\/products', icon: Package },\n    { name: 'Categories', path: '\/admin\/categories', icon: Tags },/,
  "    { name: 'Products', path: '/admin/products', icon: Package },\n    { name: 'Categories', path: '/admin/categories', icon: Tags },\n    { name: 'Homepage Editor', path: '/admin/homepage', icon: LayoutTemplate },");

fs.writeFileSync('src/pages/admin/AdminLayout.tsx', code);
