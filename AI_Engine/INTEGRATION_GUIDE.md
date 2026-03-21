# 📖 FINPLAY ANALYSIS ENGINE - COMPLETE INTEGRATION GUIDE

## 🎯 Overview

This guide walks you through **setting up, configuring, and deploying** the Analysis Engine with MongoDB Atlas.

**What you'll have:**
- ✅ Complete AI-powered analysis engine
- ✅ MongoDB integration with 7 collections
- ✅ REST API with 10+ endpoints
- ✅ Rules engine with dynamic condition evaluation
- ✅ OpenRouter API integration (Claude/GPT)
- ✅ Production-ready Node.js/Express server

---

## 🚀 QUICK START (5 Minutes)

### Step 1: Install Node.js Dependencies

```bash
# Navigate to project directory
cd path/to/analysis-engine

# Install dependencies
npm install

# Or with yarn
yarn install
```

**What gets installed:**
- `express` - Web framework
- `mongodb` - Database driver
- `axios` - HTTP client for API calls
- `dotenv` - Environment variables
- `cors` - Cross-origin requests
- `nodemon` - Auto-reload during development

---

### Step 2: Set Up Environment Variables

Create `.env` file in your project root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# MongoDB (you already have this)
MONGODB_URI=mongodb+srv://eklavyaprivate22_db_user:orCX1laryrlHQkZi@finpb.dmebfhv.mongodb.net/?appName=FinPB

# OpenRouter API Key (sign up at https://openrouter.ai)
OPENROUTER_API_KEY=sk-or-v1-your_actual_key_here

# Server
PORT=5000
NODE_ENV=development
```

**How to get OpenRouter API Key:**
1. Go to https://openrouter.ai/sign-up
2. Sign up with email
3. Go to API Keys section
4. Create new API key
5. Copy and paste into `.env`

---

### Step 3: Set Up MongoDB Collections

Go to MongoDB Atlas Console:
1. Open https://cloud.mongodb.com/
2. Click on your `finpb` cluster
3. Click "Collections" tab
4. Use MongoDB Atlas Web Shell or Compass

**Run these commands** (copy-paste from `MONGODB_SCHEMA.js`):

```javascript
// Create collections
db.createCollection("users");
db.createCollection("behavioral_tokens");
db.createCollection("performance_tokens");
db.createCollection("gameplay_tokens");
db.createCollection("rules");
db.createCollection("insights");
db.createCollection("analysis_logs");

// Create indexes
db.users.createIndex({ userId: 1 });
db.behavioral_tokens.createIndex({ userId: 1 });
db.performance_tokens.createIndex({ userId: 1 });
db.gameplay_tokens.createIndex({ userId: 1 });
db.rules.createIndex({ ruleId: 1 });
db.rules.createIndex({ isActive: 1 });
db.insights.createIndex({ userId: 1 });
db.insights.createIndex({ userId: 1, createdAt: -1 });
```

**Optional: Add Sample Data** (copy-paste from `MONGODB_SCHEMA.js`):

```javascript
// Insert sample user
db.users.insertOne({
  userId: "user_123",
  email: "test@example.com",
  name: "Test User",
  languagePreference: "Hindi",
  currentModule: "Stock Market Basics",
  joinedAt: new Date(),
  updatedAt: new Date()
});

// Insert sample behavioral tokens
db.behavioral_tokens.insertOne({
  userId: "user_123",
  attention_span: "low_fragmented",
  engagement_style: "video_skipper",
  risk_profile: "ultra_conservative",
  decision_speed: "impulsive",
  learning_pace: "average",
  updatedAt: new Date()
});

// Insert sample performance tokens
db.performance_tokens.insertOne({
  userId: "user_123",
  quiz_accuracy: 40,
  retry_frequency: "high",
  knowledge_gap: "compounding_interest",
  application_score: "low",
  concept_retention: 35,
  time_spent_minutes: 120,
  updatedAt: new Date()
});

// Insert sample gameplay tokens
db.gameplay_tokens.insertOne({
  userId: "user_123",
  asset_allocation: "100%_savings_account",
  market_reaction: "panic_sell",
  budget_adherence: "poor",
  risk_taking_behavior: "avoids_all_risk",
  emergency_fund_status: "partial",
  investment_discipline: "low",
  updatedAt: new Date()
});

// Insert sample rules
db.rules.insertOne({
  ruleId: "rule_001",
  ruleName: "Risk Identification",
  description: "Flag users with low quiz accuracy and panic selling",
  condition: "performance.quiz_accuracy < 50 AND gameplay.market_reaction == 'panic_sell'",
  action: "Generate risk warning",
  priority: 8,
  severity: "high",
  category: "risk",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

---

### Step 4: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
🤖 Initializing Analysis Engine...
✅ Connected to MongoDB Atlas successfully
✅ Database indexes created
✅ Loaded 5 active rules
✅ Analysis Engine initialized
✅ Server running on http://localhost:5000
```

---

## 📡 REST API Endpoints

### Health Check
```bash
GET http://localhost:5000/api/health

Response:
{
  "status": "healthy",
  "timestamp": "2026-03-20T10:30:00Z",
  "engine": "Analysis Engine v1.0"
}
```

### Get Engine Statistics
```bash
GET http://localhost:5000/api/stats

Response:
{
  "totalUsers": 1,
  "totalRules": 5,
  "activeRules": 5,
  "totalInsights": 2,
  "insightsToday": 1,
  "loadedRules": 5,
  "triggeredRulesLastRun": 4
}
```

### Analyze a User (MOST IMPORTANT)
```bash
GET http://localhost:5000/api/analyze/user_123

Response:
{
  "userId": "user_123",
  "insightId": "507f1f77bcf86cd799439011",
  "triggeredRules": [
    "Risk Identification",
    "Learning Gap Detection",
    "Behavioral Pattern Alert",
    "Application Failure Warning"
  ],
  "severity": "high",
  "analysis": {
    "title": "Critical Risk & Learning Gap Alert",
    "severity": "high",
    "category": "risk",
    "mainInsight": "Your low quiz accuracy (40%) combined with panic selling behavior indicates both knowledge gaps and emotional decision-making...",
    "analysis": "The triggered rules reveal a pattern...",
    "recommendations": [
      "Complete compounding interest module immediately",
      "Practice with market simulator before real trading",
      "Set automatic rebalancing rules to avoid panic selling"
    ],
    "nextSteps": "Start compounding interest module today, spend 30 mins on simulator exercises",
    "reasoning": "These insights matter because emotional decisions during market volatility can permanently damage long-term wealth..."
  }
}
```

### Get User Tokens
```bash
GET http://localhost:5000/api/user/user_123

Response:
{
  "user": { userId, email, name, ... },
  "behavioral": { attention_span, engagement_style, ... },
  "performance": { quiz_accuracy, retry_frequency, ... },
  "gameplay": { asset_allocation, market_reaction, ... }
}
```

### Update Behavioral Tokens
```bash
PUT http://localhost:5000/api/tokens/user_123/behavioral
Content-Type: application/json

Body:
{
  "attention_span": "medium",
  "engagement_style": "reader",
  "risk_profile": "moderate",
  "decision_speed": "deliberate",
  "learning_pace": "average"
}

Response:
{
  "success": true,
  "userId": "user_123",
  "type": "behavioral",
  "message": "Behavioral tokens updated"
}
```

### Update Performance Tokens
```bash
PUT http://localhost:5000/api/tokens/user_123/performance
Content-Type: application/json

Body:
{
  "quiz_accuracy": 65,
  "retry_frequency": "low",
  "knowledge_gap": "sip_vs_lumpsum",
  "application_score": "medium",
  "concept_retention": 60,
  "time_spent_minutes": 180
}
```

### Update Gameplay Tokens
```bash
PUT http://localhost:5000/api/tokens/user_123/gameplay
Content-Type: application/json

Body:
{
  "asset_allocation": "diversified",
  "market_reaction": "buy_dip",
  "budget_adherence": "good",
  "risk_taking_behavior": "calculated_risk",
  "emergency_fund_status": "adequate",
  "investment_discipline": "medium"
}
```

### Get User Insights
```bash
GET http://localhost:5000/api/insights/user_123?limit=5

Response:
{
  "userId": "user_123",
  "count": 3,
  "insights": [
    { timestamp, analysis, severity, ... },
    { timestamp, analysis, severity, ... }
  ]
}
```

### Get All Active Rules
```bash
GET http://localhost:5000/api/rules

Response:
{
  "count": 5,
  "rules": [
    { ruleId, ruleName, condition, priority, severity, ... },
    ...
  ]
}
```

### Create/Update a Rule
```bash
POST http://localhost:5000/api/rules
Content-Type: application/json

Body:
{
  "ruleId": "rule_006",
  "ruleName": "Emergency Fund Alert",
  "description": "User has no emergency fund",
  "condition": "gameplay.emergency_fund_status == 'none'",
  "action": "Recommend emergency fund building",
  "priority": 9,
  "severity": "critical",
  "category": "risk",
  "isActive": true
}

Response:
{
  "success": true,
  "ruleId": "rule_006",
  "message": "Rule saved successfully"
}
```

### Batch Analyze Multiple Users
```bash
POST http://localhost:5000/api/analyze/batch
Content-Type: application/json

Body:
{
  "userIds": ["user_123", "user_456", "user_789"]
}

Response:
{
  "totalUsers": 3,
  "analyzedUsers": 3,
  "results": [
    { userId, insightId, triggeredRules, severity, ... },
    { userId, insightId, triggeredRules, severity, ... },
    { userId, insightId, triggeredRules, severity, ... }
  ]
}
```

---

## 🔌 HOW TO CONNECT YOUR FRONTEND

### From React/Next.js Frontend

```javascript
// 1. User takes a quiz, you collect their tokens
const updateUserTokens = async (userId, tokens) => {
  // Update behavioral tokens
  await fetch(`http://localhost:5000/api/tokens/${userId}/behavioral`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tokens.behavioral)
  });

  // Update performance tokens
  await fetch(`http://localhost:5000/api/tokens/${userId}/performance`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tokens.performance)
  });

  // Update gameplay tokens
  await fetch(`http://localhost:5000/api/tokens/${userId}/gameplay`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tokens.gameplay)
  });
};

// 2. Trigger analysis
const triggerAnalysis = async (userId) => {
  const response = await fetch(`http://localhost:5000/api/analyze/${userId}`);
  const insight = await response.json();
  
  // Display insight to user
  console.log('AI Insight:', insight.analysis);
};

// 3. Get user's recent insights
const getUserInsights = async (userId) => {
  const response = await fetch(`http://localhost:5000/api/insights/${userId}?limit=10`);
  const data = await response.json();
  return data.insights;
};
```

---

## 🔐 SECURITY BEST PRACTICES

### 1. Protect Your Credentials
- ✅ Never commit `.env` to git
- ✅ Use `.gitignore`:
  ```
  .env
  .env.local
  node_modules/
  logs/
  ```

### 2. Validate API Requests
```javascript
// In server.js, add request validation middleware
app.use((req, res, next) => {
  if (!req.body) return res.status(400).json({ error: 'Invalid request' });
  next();
});
```

### 3. Rate Limiting (Optional)
```bash
npm install express-rate-limit

// In server.js
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});
app.use('/api/', limiter);
```

### 4. Use HTTPS in Production
- Deploy to Heroku, Vercel, or AWS
- Always use HTTPS (not HTTP)

---

## 🧪 TESTING THE SYSTEM

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

### Test 2: Analyze User with Sample Data
```bash
curl http://localhost:5000/api/analyze/user_123
```

### Test 3: Create Custom Rule
```bash
curl -X POST http://localhost:5000/api/rules \
  -H "Content-Type: application/json" \
  -d '{
    "ruleId": "rule_test",
    "ruleName": "Test Rule",
    "condition": "performance.quiz_accuracy < 50",
    "action": "Test action",
    "priority": 5,
    "severity": "low",
    "category": "learning",
    "isActive": true
  }'
```

---

## 📊 DEPLOYMENT GUIDE

### Deploy to Heroku (Free)

```bash
# 1. Create Heroku account
# 2. Install Heroku CLI
# 3. Login
heroku login

# 4. Create app
heroku create finplay-engine

# 5. Set environment variables
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set OPENROUTER_API_KEY="your_api_key"

# 6. Deploy
git push heroku main

# 7. View logs
heroku logs --tail

# 8. Access your API
# https://finplay-engine.herokuapp.com/api/health
```

### Deploy to Vercel (For Frontend + Serverless)

```bash
# 1. Convert server.js to Vercel serverless function
# 2. Create /api/index.js with Express app
# 3. Deploy
vercel deploy
```

---

## 🆘 TROUBLESHOOTING

### Problem: "MongoDB connection failed"
**Solution:**
- Check MONGODB_URI in .env
- Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0)
- Test connection with MongoDB Compass

### Problem: "OpenRouter API error: 401 Unauthorized"
**Solution:**
- Verify OPENROUTER_API_KEY is correct
- Check API key at https://openrouter.ai/keys
- Generate new key if expired

### Problem: "Rule evaluation error"
**Solution:**
- Check rule condition syntax
- Verify token values exist in database
- Use MongoDB Compass to inspect data

### Problem: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

---

## 📈 NEXT STEPS

1. **Add Authentication**: Implement JWT for secure API access
2. **Add Batch Scheduler**: Run analysis on schedule using `node-cron`
3. **Build Admin Dashboard**: Create web UI to manage rules
4. **Add Webhooks**: Send insights to user's email/SMS
5. **Monitor Performance**: Add APM (Application Performance Monitoring)

---

## 📚 FILE STRUCTURE

```
finplay-analysis-engine/
├── server.js                 # Express server & API routes
├── analysisEngine.js         # Core AI analysis logic
├── rulesEngine.js           # Rule parser & evaluator
├── database.js              # MongoDB connection & queries
├── logger.js                # Logging utility
├── package.json             # Dependencies
├── .env.example             # Environment template
├── MONGODB_SCHEMA.js        # Database schema & sample data
├── INTEGRATION_GUIDE.md     # This file
├── .gitignore              # Ignore .env and node_modules
└── logs/                   # Auto-generated logs directory
```

---

## 💡 PRO TIPS

- **Monitor API Usage**: Log requests to track which endpoints are used most
- **Cache Rules**: Load rules once at startup to avoid repeated DB queries
- **Batch Processing**: Analyze multiple users at once for efficiency
- **Error Handling**: Always use try-catch for database operations
- **Testing**: Use Postman or Thunder Client to test API endpoints

---

**🎉 You're all set! Your Analysis Engine is ready to go live.**

For questions, check the code comments or refer to the MongoDB/Express documentation.
