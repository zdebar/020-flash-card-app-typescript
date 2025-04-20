import admin from "firebase-admin";
import * as serviceAccount from "D:/Active/020_Secrets/english-app-737f5-firebase-adminsdk-fbsvc-efb55b7d8b.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const firebaseAuth = admin.auth();
