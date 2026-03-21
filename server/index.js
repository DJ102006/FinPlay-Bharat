import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveMongoConnectionUri } from './mongoUri.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@finplaybharat.com';
const DB_NAME = process.env.MONGODB_DB_NAME || 'finplay_bharat';
const JWT_SECRET = process.env.JWT_SECRET;
const uri = process.env.MONGODB_URI;

const missingEnvVars = ['MONGODB_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

app.use(cors());
app.use(express.json());

let client = null;
let db = null;

async function connectDB() {
  console.log("Attempting to connect to MongoDB Atlas...");
  const connectionUri = await resolveMongoConnectionUri(uri);
  client = new MongoClient(connectionUri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  });
  await client.connect();
  db = client.db(DB_NAME);
  await db.command({ ping: 1 });
  console.log(`✅ Connected to MongoDB Atlas database "${DB_NAME}"`);
}

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

function requireDatabase(req, res, next) {
  if (!db) {
    return res.status(503).json({
      message: 'Database connection is unavailable. Check MongoDB configuration and connectivity.',
    });
  }
  next();
}

function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

async function requireAdmin(req, res, next) {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) });
    if (!user || !user.isAdmin)
      return res.status(403).json({ message: 'Admin access required' });
    next();
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    database: db ? 'connected' : 'disconnected',
    databaseName: DB_NAME,
  });
});

app.post('/api/auth/signup', requireDatabase, async (req, res) => {
  try {
    const { name, email, password, age, language } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const trimmedName = name?.trim();

    if (!trimmedName || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const usersCol = db.collection('users');
    if (await usersCol.findOne({ email: normalizedEmail }))
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const isAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();

    const result = await usersCol.insertOne({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      age: age ?? null,
      language: language ?? null,
      isAdmin,
      finCoins: 100, // Initial bonus
      streak: 1,
      lastLogin: new Date(),
      totalScore: 0,
      createdAt: new Date()
    });

    const token = jwt.sign({ id: result.insertedId.toString() }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: {
        id: result.insertedId.toString(),
        name: trimmedName,
        email: normalizedEmail,
        isAdmin,
        finCoins: 100,
        streak: 1,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/auth/login', requireDatabase, async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const usersCol = db.collection('users');
    const user = await usersCol.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!await bcrypt.compare(password, user.password))
      return res.status(400).json({ message: 'Invalid credentials' });

    // Handle Daily Streak & Bonus
    const now = new Date();
    const last = new Date(user.lastLogin || 0);
    const dayDiff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    
    let newStreak = user.streak || 1;
    let coinsEarned = 0;

    if (dayDiff === 1) {
      newStreak += 1;
      coinsEarned = 20; // Daily bonus
    } else if (dayDiff > 1) {
      newStreak = 1; // Reset
    }

    await usersCol.updateOne(
      { _id: user._id },
      { 
        $set: { lastLogin: now, streak: newStreak },
        $inc: { finCoins: coinsEarned }
      }
    );

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { 
      id: user._id.toString(), name: user.name, email: user.email, isAdmin: user.isAdmin,
      finCoins: (user.finCoins || 0) + coinsEarned, streak: newStreak
    }});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────

app.get('/api/leaderboard', requireDatabase, async (req, res) => {
  try {
    const top = await db.collection('users')
      .find({}, { projection: { name: 1, totalScore: 1, streak: 1 } })
      .sort({ totalScore: -1 })
      .limit(10)
      .toArray();
    res.json(top);
  } catch {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// ─── ACTIVITY ─────────────────────────────────────────────────────────────────

app.post('/api/activity', requireDatabase, verifyToken, async (req, res) => {
  try {
    const { gameType, score, progress } = req.body;
    const usersCol = db.collection('users');
    const userId = req.user.id;

    if (!gameType || !progress) {
      return res.status(400).json({ message: 'Game type and progress are required' });
    }
    
    // Reward coins for completing a hub
    let coinsToAward = 0;
    if (progress === 'Completed') coinsToAward = 150;
    const numericScore = Number.isFinite(Number(score)) ? Number(score) : 0;
    const userObjectId = new ObjectId(userId);
    const existingUser = await usersCol.findOne({ _id: userObjectId }, { projection: { _id: 1 } });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Promise.all([
      db.collection('activity').insertOne({
        userId: userObjectId,
        gameType,
        score: numericScore,
        progress,
        updatedAt: new Date()
      }),
      usersCol.updateOne(
        { _id: userObjectId },
        { 
          $inc: { finCoins: coinsToAward, totalScore: numericScore }
        }
      )
    ]);

    res.json({ success: true, coinsAwarded: coinsToAward });
  } catch (err) {
    res.status(500).json({ message: 'Error saving activity', error: err.message });
  }
});

// ─── UPDATES (Public Read) ────────────────────────────────────────────────────

app.get('/api/updates', requireDatabase, async (req, res) => {
  try {
    const updates = await db.collection('updates').find({}).sort({ createdAt: -1 }).toArray();
    res.json(updates);
  } catch {
    res.status(500).json({ message: 'Error fetching updates' });
  }
});

// ─── UPDATES (Admin Write/Delete) ────────────────────────────────────────────

app.post('/api/updates', requireDatabase, verifyToken, requireAdmin, async (req, res) => {
  try {
    const { title, body, category, emoji } = req.body;
    if (!title || !body) return res.status(400).json({ message: 'Title and body required' });

    const result = await db.collection('updates').insertOne({
      title, body,
      category: category || 'Feature',
      emoji: emoji || '🚀',
      createdAt: new Date()
    });
    res.status(201).json({ success: true, id: result.insertedId });
  } catch {
    res.status(500).json({ message: 'Error creating update' });
  }
});

app.delete('/api/updates/:id', requireDatabase, verifyToken, requireAdmin, async (req, res) => {
  try {
    await db.collection('updates').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Error deleting update' });
  }
});

// ─── ADMIN STATS ──────────────────────────────────────────────────────────────

app.get('/api/admin/stats', requireDatabase, verifyToken, requireAdmin, async (req, res) => {
  try {
    const [totalUsers, completions, totalUpdates] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('activity').countDocuments({ progress: 'Completed' }),
      db.collection('updates').countDocuments(),
    ]);
    res.json({ totalUsers, completions, totalUpdates });
  } catch {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Failed to start backend:', error.name, error.message);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await client?.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await client?.close();
  process.exit(0);
});

startServer();
