const fs = require('fs');
let code = fs.readFileSync('src/context/ShopContext.tsx', 'utf8');

// Insert interface fields
code = code.replace(/  banners: Banner\[\];/, "  banners: Banner[];\n  homepageSettings: HomepageSettings | null;\n  updateHomepageSettings: (settings: HomepageSettings) => Promise<void>;");

// Insert state
code = code.replace(/  const \[banners, setBanners\] = useState<Banner\[\]>\(\[\]\);/, "  const [banners, setBanners] = useState<Banner[]>([]);\n  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);");

// Insert subscribeToFirestore snapshot
const snapshotCode = `
      // Settings listener
      const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'homepage'), (docSnap) => {
        if (docSnap.exists()) {
          setHomepageSettings(docSnap.data() as HomepageSettings);
        } else {
          setHomepageSettings(null);
        }
      }, (err) => {
        console.error("Settings listener error:", err);
      });
`;
code = code.replace(/      setLoading\(false\);\n      setError\(null\);\n      setErrorDetails\(null\);/, `${snapshotCode}\n      setLoading(false);\n      setError(null);\n      setErrorDetails(null);`);

// Insert update function
const updateFnCode = `
  const updateHomepageSettings = async (settings: HomepageSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'homepage'), settings);
    } catch (err) {
      console.error("Failed to update homepage settings:", err);
      throw err;
    }
  };
`;
code = code.replace(/  const seedInitialDataIfEmpty = async \(\) => {/, `${updateFnCode}\n  const seedInitialDataIfEmpty = async () => {`);

// Insert into Provider value
code = code.replace(/        banners,/, "        banners,\n        homepageSettings,\n        updateHomepageSettings,");

// Update seed data
const seedCode = `
      // 4. Initial Homepage Settings
      await setDoc(doc(db, 'settings', 'homepage'), {
        hero: {
          heading: 'WELCOME TO',
          highlightedWord: 'AMAX CRAFT',
          subheading: 'Your Home Creating Beautiful Ambience',
          description: 'Specialized CNC Laser Cutting Jalis, Architectural Room Dividers, Designer Railing Strips, Balcony Screens, and Traditional Wedding Accessories crafted to custom precision.',
          backgroundImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
          badgeText: 'Laser Cut Craftsmanship & Architectural Jalis',
          primaryButtonText: 'Explore Full Catalog',
          secondaryButtonText: 'Chat on WhatsApp',
          secondaryButtonLink: 'https://wa.me/919876543210'
        },
        announcementText: '🎉 Free Shipping on all orders above ₹50,000! Use code AMAXFREE'
      });
`;
code = code.replace(/      setSeedSuccessMessage\(`Successfully synchronized initial catalog to Firestore database/g, `${seedCode}\n      setSeedSuccessMessage(\`Successfully synchronized initial catalog to Firestore database`);

fs.writeFileSync('src/context/ShopContext.tsx', code);
