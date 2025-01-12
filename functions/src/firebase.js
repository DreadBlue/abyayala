const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const storage = new Storage();
const bucketLink = process.env.STORAGE_BUCKET;
const bucket = storage.bucket(`${bucketLink}`);

module.exports = {
  db,
  auth,
  bucket,
};
