const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Check for serviceAccountKey.json
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("Error: Please place your Firebase serviceAccountKey.json in the scripts/ directory.");
  console.log("Usage instructions:");
  console.log("1. Go to Firebase Console -> Project Settings -> Service Accounts");
  console.log("2. Click 'Generate new private key' and save as scripts/serviceAccountKey.json");
  console.log("3. Run: node scripts/setAdminClaim.cjs <USER_UID>");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function makeAdmin(uid) {
  if (!uid) {
    console.error("Please provide a user UID. Example: node scripts/setAdminClaim.cjs <FIREBASE_USER_UID>");
    process.exit(1);
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Successfully assigned custom claim { admin: true } to UID: ${uid}`);
    console.log("Important: The user must logout and login again (or refresh token via getIdToken(true)) for changes to take effect.");
  } catch (error) {
    console.error("Error setting custom user claim:", error);
  }
}

const targetUid = process.argv[2];
makeAdmin(targetUid);
