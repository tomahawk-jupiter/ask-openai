const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', false);

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER;

const dropAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
      console.log(`Collection: ${collectionName} has been dropped`);
    } catch (err) {
      if (error.message === 'ns not found') return;
      if (error.message.includes('a background operation is currently running'))
        return;
    }
  }
};

module.exports = {
  setupTestDB(dbName) {
    beforeAll(async () => {
      const mongoConnectionString = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.psiey.mongodb.net/${dbName}?retryWrites=true&w=majority`;

      try {
        await mongoose.connect(mongoConnectionString);
        console.log(`Connected to test DB.`);
      } catch (err) {
        console.log(err);
      }
    });

    afterAll(async () => {
      try {
        await dropAllCollections();
        console.log('DB cleanup completed.');
      } catch (err) {
        console.log(err);
      }

      try {
        await mongoose.connection.close();
        console.log('Connection to DB closed.');
      } catch (err) {
        console.log(err);
      }
    });
  }
};
