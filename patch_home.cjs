const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace(/const { products, categories, banners, loading, activeProductsCount, seedInitialDataIfEmpty, isSeeding } = useShop\(\);/,
  "const { products, categories, banners, loading, activeProductsCount, seedInitialDataIfEmpty, isSeeding, homepageSettings } = useShop();");

code = code.replace(/<div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" style={{ backgroundImage: \`url\('https:\/\/images.unsplash.com\/photo-1600585154340-be6161a56a0c\?auto=format&fit=crop&w=1600&q=80'\)\` }} \/>/,
  `<div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" style={{ backgroundImage: \`url('\${homepageSettings?.hero?.backgroundImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'}')\` }} />`);

code = code.replace(/<span>Laser Cut Craftsmanship & Architectural Jalis<\/span>/,
  `<span>{homepageSettings?.hero?.badgeText || 'Laser Cut Craftsmanship & Architectural Jalis'}</span>`);

code = code.replace(/WELCOME TO <span className="text-\\[#C7953E\\]">AMAX CRAFT<\/span>/,
  `{homepageSettings?.hero?.heading || 'WELCOME TO'} <span className="text-[#C7953E]">{homepageSettings?.hero?.highlightedWord || 'AMAX CRAFT'}</span>`);

code = code.replace(/Your Home Creating Beautiful Ambience/,
  `{homepageSettings?.hero?.subheading || 'Your Home Creating Beautiful Ambience'}`);

code = code.replace(/Specialized CNC Laser Cutting Jalis, Architectural Room Dividers, Designer Railing Strips, Balcony Screens, and Traditional Wedding Accessories crafted to custom precision./,
  `{homepageSettings?.hero?.description || 'Specialized CNC Laser Cutting Jalis, Architectural Room Dividers, Designer Railing Strips, Balcony Screens, and Traditional Wedding Accessories crafted to custom precision.'}`);

code = code.replace(/<span>Explore Full Catalog<\/span>/,
  `<span>{homepageSettings?.hero?.primaryButtonText || 'Explore Full Catalog'}</span>`);

code = code.replace(/<span>Chat on WhatsApp<\/span>/,
  `<span>{homepageSettings?.hero?.secondaryButtonText || 'Chat on WhatsApp'}</span>`);
  
code = code.replace(/href="https:\/\/wa.me\/919876543210"/,
  `href={homepageSettings?.hero?.secondaryButtonLink || 'https://wa.me/919876543210'}`);
  
fs.writeFileSync('src/pages/Home.tsx', code);
