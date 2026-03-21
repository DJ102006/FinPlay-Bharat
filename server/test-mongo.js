import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveMongoConnectionUri } from './mongoUri.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not defined in .env");
  process.exit(1);
}

async function run() {
  let client;
  try {
    const connectionUri = await resolveMongoConnectionUri(uri);
    client = new MongoClient(connectionUri);
    await client.connect();
    console.log("SUCCESS: Connected to MongoDB Atlas!");
  } catch (err) {
    console.error("FAILURE: Could not connect to MongoDB Atlas.");
    console.error(err);
  } finally {
    await client?.close().catch(() => {});
    process.exit();
  }
}
run();
