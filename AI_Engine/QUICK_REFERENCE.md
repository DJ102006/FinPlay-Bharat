# 🚀 FINPLAY ANALYSIS ENGINE - QUICK REFERENCE

## ⚡ Start Server (60 seconds)

```bash
# 1. Install
npm install

# 2. Create .env with your credentials
cp .env.example .env
# Edit .env and add:
# MONGODB_URI=mongodb+srv://eklavyaprivate22_db_user:orCX1laryrlHQkZi@finpb.dmebfhv.mongodb.net/?appName=FinPB
# OPENROUTER_API_KEY=sk-or-v1-your_key_here

# 3. Set up MongoDB collections (run in Atlas Web Shell):
# db.createCollection("users");
# db.createCollection("behavioral_tokens");
# db.createCollection("performance_tokens");
# db.createCollection("gameplay_tokens");
# db.createCollection("rules");
# db.createCollection("insights");
# db.createCollection("analysis_logs");

# 4. Run
npm run dev
```

---

## 📡 API ENDPOINTS CHEATSHEET

### 1. **Analyze User** (Main Endpoint)
```bash
curl http://localhost:5000/api/analyze/user_123
```
**Returns**: AI-generated insights with triggered rules and recommendations

### 2. **Update User Tokens** (3 endpoints)
```bash
# Behavioral tokens
curl -X PUT http://localhost:5000/api/tokens/user_123/behavioral \
  -H "Content-Type: application/json" \
  -d '{"attention_span":"medium","engagement_style":"reader",...}'

# Performance tokens
curl -X PUT http://localhost:5000/api/tokens/user_123/performance \
  -H "Content-Type: application/json" \
  -d '{"quiz_accuracy":65,"retry_frequency":"low",...}'

# Gameplay tokens
curl -X PUT http://localhost:5000/api/tokens/user_123/gameplay \
  -H "Content-Type: application/json" \
  -d '{"asset_allocation":"diversified","market_reaction":"buy_dip",...}'
```

### 3. **Get User Data**
```bash
# Get user with all tokens
curl http://localhost:5000/api/user/user_123

# Get user's recent insights
curl http://localhost:5000/api/insights/user_123?limit=10
```

### 4. **Manage Rules**
```bash
# Get all active rules
curl http://localhost:5000/api/rules

# Create new rule
curl -X POST http://localhost:5000/api/rules \
  -H "Content-Type: application/json" \
  -d '{
    "ruleId":"rule_006",
    "ruleName":"Emergency Fund Alert",
    "condition":"gameplay.emergency_fund_status == '\''none'\''",
    "action":"Recommend emergency fund",
    "priority":9,
    "severity":"critical",
    "category":"risk",
    "isActive":true
  }'
```

### 5. **Batch Analysis**
```bash
curl -X POST http://localhost:5000/api/analyze/batch \
  -H "Content-Type: application/json" \
  -d '{"userIds":["user_123","user_456","user_789"]}'
```

### 6. **System Info**
```bash
# Health check
curl http://localhost:5000/api/health

# Engine stats
curl http://localhost:5000/api/stats
```

---

## 🗄️ MONGODB CONNECTION STRING

Your connection string is already set up:
```
mongodb+srv://eklavyaprivate22_db_user:orCX1laryrlHQkZi@finpb.dmebfhv.mongodb.net/?appName=FinPB
```

**In .env:**
```env
MONGODB_URI=mongodb+srv://eklavyaprivate22_db_user:orCX1laryrlHQkZi@finpb.dmebfhv.mongodb.net/?appName=FinPB
```

**Database Name:** `FinPB`

---

## 📋 SAMPLE DATA FOR TESTING

### Insert Test User
```javascript
// In MongoDB Atlas Web Shell
db.users.insertOne({
  userId: "test_user_001",
  email: "test@example.com",
  name: "Test User",
  languagePreference: "Hindi",
  currentModule: "Stock Market Basics",
  joinedAt: new Date(),
  updatedAt: new Date()
});
```

### Insert Test Tokens
```javascript
// Behavioral tokens
db.behavioral_tokens.insertOne({
  userId: "test_user_001",
  attention_span: "low_fragmented",
  engagement_style: "video_skipper",
  risk_profile: "ultra_conservative",
  decision_speed: "impulsive",
  learning_pace: "average",
  updatedAt: new Date()
});

// Performance tokens
db.performance_tokens.insertOne({
  userId: "test_user_001",
  quiz_accuracy: 40,
  retry_frequency: "high",
  knowledge_gap: "compounding_interest",
  application_score: "low",
  concept_retention: 35,
  time_spent_minutes: 120,
  updatedAt: new Date()
});

// Gameplay tokens
db.gameplay_tokens.insertOne({
  userId: "test_user_001",
  asset_allocation: "100%_savings_account",
  market_reaction: "panic_sell",
  budget_adherence: "poor",
  risk_taking_behavior: "avoids_all_risk",
  emergency_fund_status: "partial",
  investment_discipline: "low",
  updatedAt: new Date()
});
```

### Insert Sample Rules
```javascript
db.rules.insertMany([
  {
    ruleId: "rule_001",
    ruleName: "Risk Identification",
    description: "Low quiz accuracy + panic selling",
    condition: "performance.quiz_accuracy < 50 AND gameplay.market_reaction == 'panic_sell'",
    action: "Generate risk warning",
    priority: 8,
    severity: "high",
    category: "risk",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ruleId: "rule_002",
    ruleName: "Learning Gap Detection",
    description: "Low application score + low accuracy",
    condition: "performance.application_score == 'low' AND performance.quiz_accuracy < 60",
    action: "Recommend targeted content",
    priority: 7,
    severity: "high",
    category: "learning",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ruleId: "rule_003",
    ruleName: "Behavioral Pattern Alert",
    description: "Low engagement + fragmented attention",
    condition: "behavioral.attention_span == 'low_fragmented' AND behavioral.engagement_style == 'video_skipper'",
    action: "Suggest different content format",
    priority: 6,
    severity: "medium",
    category: "behavior",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    ruleId: "rule_004",
    ruleName: "Application Failure",
    description: "Poor budget adherence + low discipline",
    condition: "gameplay.budget_adherence == 'poor' AND gameplay.investment_discipline == 'low'",
    action: "Focus on practical application",
    priority: 9,
    severity: "critical",
    category: "application",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
```

---

## 🔗 HOW TO INTEGRATE WITH FRONTEND

### React Example
```javascript
// 1. Update tokens when user completes quiz
const updateTokens = async (userId) => {
  const tokens = {
    behavioral: {
      attention_span: "medium",
      engagement_style: "reader",
      risk_profile: "moderate"
    },
    performance: {
      quiz_accuracy: 65,
      retry_frequency: "low",
      knowledge_gap: "sip_vs_lumpsum"
    },
    gameplay: {
      asset_allocation: "diversified",
      market_reaction: "buy_dip"
    }
  };

  // Update all tokens
  await Promise.all([
    fetch(`http://localhost:5000/api/tokens/${userId}/behavioral`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tokens.behavioral)
    }),
    fetch(`http://localhost:5000/api/tokens/${userId}/performance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tokens.performance)
    }),
    fetch(`http://localhost:5000/api/tokens/${userId}/gameplay`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tokens.gameplay)
    })
  ]);
};

// 2. Trigger analysis
const getInsights = async (userId) => {
  const response = await fetch(`http://localhost:5000/api/analyze/${userId}`);
  const insight = await response.json();
  return insight.analysis; // AI-generated insight
};

// 3. Display to user
useEffect(() => {
  const insight = await getInsights(userId);
  setInsight(insight);
}, [userId]);
```

---

## 📊 ANALYSIS ENGINE WORKFLOW

```
1. User takes quiz/simulator
   ↓
2. Update tokens via API
   PUT /api/tokens/:userId/behavioral
   PUT /api/tokens/:userId/performance
   PUT /api/tokens/:userId/gameplay
   ↓
3. Trigger analysis
   GET /api/analyze/:userId
   ↓
4. Engine:
   - Loads user tokens from MongoDB
   - Evaluates all active rules
   - Identifies triggered rules
   - Builds AI analysis context
   - Calls OpenRouter API
   - Saves insight to MongoDB
   ↓
5. Returns AI insight with:
   - Title & severity
   - Analysis paragraph
   - Recommendations
   - Next steps
   ↓
6. Display to user in frontend
```

---

## 🔑 TOKEN VALUES & ENUMS

### Behavioral Tokens
```
attention_span: "high" | "medium" | "low_fragmented"
engagement_style: "video_watcher" | "reader" | "simulator" | "podcast_listener" | "video_skipper"
risk_profile: "ultra_conservative" | "conservative" | "moderate" | "aggressive" | "ultra_aggressive"
decision_speed: "impulsive" | "fast" | "deliberate" | "slow"
learning_pace: "quick_learner" | "average" | "slow_learner" | "struggling"
```

### Performance Tokens
```
quiz_accuracy: 0-100 (percentage)
retry_frequency: "low" | "medium" | "high"
knowledge_gap: "compounding_interest" | "tax_planning" | "sip_vs_lumpsum" | "inflation" | "asset_allocation" | "none"
application_score: "low" | "medium" | "high"
concept_retention: 0-100 (percentage)
```

### Gameplay Tokens
```
asset_allocation: "100%_savings_account" | "diversified" | "bonds_heavy" | "stocks_heavy" | "crypto_heavy"
market_reaction: "panic_sell" | "hold" | "buy_dip" | "no_reaction" | "sell_high"
budget_adherence: "poor" | "fair" | "good" | "excellent"
risk_taking_behavior: "avoids_all_risk" | "calculated_risk" | "reckless"
emergency_fund_status: "none" | "partial" | "adequate" | "excellent"
investment_discipline: "low" | "medium" | "high"
```

---

## 🧪 TEST FLOW (Copy-Paste)

```bash
# 1. Health check
curl http://localhost:5000/api/health

# 2. Get stats
curl http://localhost:5000/api/stats

# 3. Get test user
curl http://localhost:5000/api/user/test_user_001

# 4. Analyze test user (MAIN TEST)
curl http://localhost:5000/api/analyze/test_user_001

# 5. View rules
curl http://localhost:5000/api/rules

# 6. Get insights
curl http://localhost:5000/api/insights/test_user_001
```

---

## 🚨 COMMON ERRORS & FIXES

| Error | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED` | Server not running | `npm run dev` |
| `MongoDB connection failed` | Wrong URI or network issue | Check `.env` and IP whitelist |
| `401 Unauthorized` | Invalid API key | Verify OpenRouter key in `.env` |
| `No JSON found in API response` | API returned non-JSON | Check OpenRouter response format |
| `User tokens not found` | Tokens not in database | Insert sample data first |
| `Rule evaluation error` | Bad condition syntax | Check rule condition format |

---

## 📞 SUPPORT

- **MongoDB Help**: https://docs.mongodb.com
- **Express.js Help**: https://expressjs.com
- **OpenRouter Docs**: https://openrouter.ai/docs
- **Node.js Docs**: https://nodejs.org/docs

**Need help?** Check logs in `/logs` directory for detailed error messages.
