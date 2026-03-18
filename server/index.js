import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("finplay_bharat");
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectDB();

// --- AUTH ENDPOINTS ---

// Register
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, age, language } = req.body;

    const usersCollection = db.collection("users");
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password (12 salt rounds as per privacy-policy.html)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      age,
      language,
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);
    
    // Create JWT
    const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: result.insertedId, name, email } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// --- ACTIVITY ENDPOINTS ---

app.post('/api/activity', async (req, res) => {
  try {
    const { userId, gameType, score, progress } = req.body;
    const activityCollection = db.collection("activity");

    await activityCollection.insertOne({
      userId: new ObjectId(userId),
      gameType,
      score,
      progress,
      updatedAt: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error saving activity" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
