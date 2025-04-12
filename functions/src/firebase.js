const dotoenv = require('dotenv');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');

dotoenv.config();

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const storage = new Storage({
  credentials: {
    type: 'service_account',
    project_id: process.env.PROJECT_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // Asegúrate de que las claves privadas estén bien formateadas
    client_email: process.env.CLIENT_EMAIL,
  },
});
const bucketLink = process.env.STORAGE_BUCKET;
const bucket = storage.bucket(`${bucketLink}`);

module.exports = {
  db,
  auth,
  bucket,
};
