import { createRequire } from "module";
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

// Use createRequire instead of `import ... with { type: "json" }`.
// The import-attribute syntax is not reliably supported across every
// Node.js runtime version, and a SyntaxError/parse failure here at
// module load time would crash the ENTIRE serverless function,
// taking down every unrelated /api/* route with it.
const require = createRequire(import.meta.url);

let db: Firestore | undefined;
let auth: Auth | undefined;

try {
  const firebaseConfig = require("../../firebase-applet-config.json");
  const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
  auth = getAuth(app);
} catch (err) {
  // Never let a Firebase init failure take down the whole server module.
  // Routes that depend on `db`/`auth` will fail individually instead of
  // every /api/* endpoint returning 500.
  console.error("Firebase initialization failed:", err);
}

export { db, auth };
