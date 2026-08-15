/**
 * One-time admin claim setup script using Firebase Admin SDK.
 * 
 * Usage:
 *   node scripts/set-admin.cjs <FIREBASE_USER_UID>
 * 
 * Requirements:
 *   1. Download serviceAccountKey.json from Firebase Console -> Project Settings -> Service Accounts.
 *   2. Place serviceAccountKey.json in the project root directory (it is ignored by .gitignore).
 *   3. Run: npm install firebase-admin
 *   4. Run: node scripts/set-admin.cjs <FIREBASE_USER_UID>
 */

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceAccountPath = path.resolve(__dirname, "../serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("ERROR: serviceAccountKey.json not found in project root.");
  console.error("Please download serviceAccountKey.json from Firebase Console -> Project Settings -> Service Accounts and place it at:", serviceAccountPath);
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = process.argv[2];

if (!uid) {
  console.error("Usage: node scripts/set-admin.cjs <FIREBASE_USER_UID>");
  process.exit(1);
}

admin.auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("Successfully set custom claim { admin: true } for UID:", uid);
    console.log("Important: The user MUST sign out and sign in again (or force token refresh) for changes to take effect.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to set admin custom claim:", error);
    process.exit(1);
  });
