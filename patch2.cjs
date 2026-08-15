const fs = require('fs');
let code = fs.readFileSync('src/context/ShopContext.tsx', 'utf8');

// Insert settings listener
const settingsListener = `
      let unsubSettings = null;
      try {
        unsubSettings = onSnapshot(doc(db, 'settings', 'homepage'), (docSnap) => {
          if (docSnap.exists()) {
            setHomepageSettings(docSnap.data());
          } else {
            setHomepageSettings(null);
          }
        }, (err) => {
          console.error("Settings listener error:", err);
        });
      } catch (err) {
        console.error("Error setting up homepage settings listener:", err);
      }
`;

code = code.replace(/    return \(\) => {/, `${settingsListener}\n    return () => {\n      if (unsubSettings) unsubSettings();`);

fs.writeFileSync('src/context/ShopContext.tsx', code);
