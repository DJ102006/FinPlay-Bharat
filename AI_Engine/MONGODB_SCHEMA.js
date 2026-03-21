/**
 * MONGODB SCHEMA SETUP
 * Collections, indexes, and sample data for FinPlay Analysis Engine
 * 
 * IMPORTANT: This file explains the MongoDB schema structure
 * You can run these commands in MongoDB Atlas console or use a script
 */

// ============================================
// 1. CREATE COLLECTIONS
// ============================================

/*
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "email"],
      properties: {
        userId: { bsonType: "string", description: "Unique user ID" },
        email: { bsonType: "string", description: "User email" },
        name: { bsonType: "string", description: "User full name" },
        languagePreference: { bsonType: "string", enum: ["English", "Hindi", "Mixed"] },
        currentModule: { bsonType: "string", description: "Current learning module" },
        joinedAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.createCollection("behavioral_tokens", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId"],
      properties: {
        userId: { bsonType: "string" },
        attention_span: { bsonType: "string", description: "high|medium|low_fragmented" },
        engagement_style: { bsonType: "string", description: "video_watcher|reader|simulator|podcast_listener|video_skipper" },
        risk_profile: { bsonType: "string", description: "ultra_conservative|conservative|moderate|aggressive|ultra_aggressive" },
        decision_speed: { bsonType: "string", description: "impulsive|fast|deliberate|slow" },
        learning_pace: { bsonType: "string", description: "quick_learner|average|slow_learner|struggling" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.createCollection("performance_tokens", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId"],
      properties: {
        userId: { bsonType: "string" },
        quiz_accuracy: { bsonType: "double", description: "Percentage 0-100" },
        retry_frequency: { bsonType: "string", description: "low|medium|high" },
        knowledge_gap: { bsonType: "string", description: "compounding_interest|tax_planning|sip_vs_lumpsum|etc" },
        application_score: { bsonType: "string", description: "low|medium|high" },
        concept_retention: { bsonType: "double", description: "Percentage 0-100" },
        time_spent_minutes: { bsonType: "int" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.createCollection("gameplay_tokens", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId"],
      properties: {
        userId: { bsonType: "string" },
        asset_allocation: { bsonType: "string", description: "100%_savings_account|diversified|etc" },
        market_reaction: { bsonType: "string", description: "panic_sell|hold|buy_dip|no_reaction" },
        budget_adherence: { bsonType: "string", description: "poor|fair|good|excellent" },
        risk_taking_behavior: { bsonType: "string", description: "avoids_all_risk|calculated_risk|reckless" },
        emergency_fund_status: { bsonType: "string", description: "none|partial|adequate|excellent" },
        investment_discipline: { bsonType: "string", description: "low|medium|high" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.createCollection("rules", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ruleId", "ruleName", "condition"],
      properties: {
        ruleId: { bsonType: "string", description: "Unique rule identifier" },
        ruleName: { bsonType: "string", description: "Human-readable rule name" },
        description: { bsonType: "string" },
        condition: { bsonType: "string", description: "Condition expression with token references" },
        action: { bsonType: "string", description: "What analysis to trigger" },
        priority: { bsonType: "int", description: "1-10, higher = more important" },
        severity: { bsonType: "string", enum: ["critical", "high", "medium", "low", "info"] },
        category: { bsonType: "string", enum: ["risk", "learning", "behavior", "application", "growth"] },
        isActive: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.createCollection("insights", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId"],
      properties: {
        userId: { bsonType: "string" },
        triggeredRules: { bsonType: "array", description: "Array of rule IDs that triggered" },
        tokenSnapshot: { bsonType: "object", description: "Snapshot of tokens at analysis time" },
        insight: { bsonType: "object", description: "AI-generated insight object" },
        severity: { bsonType: "string" },
        category: { bsonType: "string" },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

db.createCollection("analysis_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        userId: { bsonType: "string" },
        ruleId: { bsonType: "string" },
        result: { bsonType: "object" },
        executedAt: { bsonType: "date" }
      }
    }
  }
});
*/

// ============================================
// 2. SAMPLE DATA - INSERT INTO COLLECTIONS
// ============================================

/*
// Sample User
db.users.insertOne({
  userId: "user_123",
  email: "user123@example.com",
  name: "Rajesh Kumar",
  languagePreference: "Hindi",
  currentModule: "Stock Market Basics",
  joinedAt: new Date(),
  updatedAt: new Date()
});

// Sample Behavioral Tokens
db.behavioral_tokens.insertOne({
  userId: "user_123",
  attention_span: "low_fragmented",
  engagement_style: "video_skipper",
  risk_profile: "ultra_conservative",
  decision_speed: "impulsive",
  learning_pace: "average",
  updatedAt: new Date()
});

// Sample Performance Tokens
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

// Sample Gameplay Tokens
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

// Sample Rules
db.rules.insertOne({
  ruleId: "rule_001",
  ruleName: "Risk Identification",
  description: "Flag users with low quiz accuracy and panic selling behavior",
  condition: "performance.quiz_accuracy < 50 AND gameplay.market_reaction == 'panic_sell'",
  action: "Generate risk warning and suggest learning modules",
  priority: 8,
  severity: "high",
  category: "risk",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

db.rules.insertOne({
  ruleId: "rule_002",
  ruleName: "Learning Gap Detection",
  description: "Identify major knowledge gaps affecting application",
  condition: "performance.application_score == 'low' AND performance.quiz_accuracy < 60",
  action: "Recommend targeted learning content",
  priority: 7,
  severity: "high",
  category: "learning",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

db.rules.insertOne({
  ruleId: "rule_003",
  ruleName: "Behavioral Pattern Alert",
  description: "Low engagement and fragmented attention",
  condition: "behavioral.attention_span == 'low_fragmented' AND behavioral.engagement_style == 'video_skipper'",
  action: "Suggest different content format",
  priority: 6,
  severity: "medium",
  category: "behavior",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

db.rules.insertOne({
  ruleId: "rule_004",
  ruleName: "Application Failure Warning",
  description: "Poor budget adherence and low investment discipline",
  condition: "gameplay.budget_adherence == 'poor' AND gameplay.investment_discipline == 'low'",
  action: "Focus on practical application and habit formation",
  priority: 9,
  severity: "critical",
  category: "application",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

db.rules.insertOne({
  ruleId: "rule_005",
  ruleName: "Risk Profile Mismatch",
  description: "Ultra-conservative profile with 100% savings",
  condition: "behavioral.risk_profile == 'ultra_conservative' AND gameplay.asset_allocation == '100%_savings_account'",
  action: "Educate on inflation impact and calculated risk",
  priority: 5,
  severity: "low",
  category: "growth",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
*/

// ============================================
// 3. CREATE INDEXES FOR PERFORMANCE
// ============================================

/*
// User indexes
db.users.createIndex({ userId: 1 });
db.users.createIndex({ email: 1 });

// Token indexes
db.behavioral_tokens.createIndex({ userId: 1 });
db.performance_tokens.createIndex({ userId: 1 });
db.gameplay_tokens.createIndex({ userId: 1 });

// Rules indexes
db.rules.createIndex({ ruleId: 1 });
db.rules.createIndex({ isActive: 1 });

// Insights indexes
db.insights.createIndex({ userId: 1 });
db.insights.createIndex({ createdAt: -1 });
db.insights.createIndex({ userId: 1, createdAt: -1 });

// Logs indexes
db.analysis_logs.createIndex({ userId: 1 });
db.analysis_logs.createIndex({ executedAt: -1 });
*/

// ============================================
// 4. VERIFY SETUP
// ============================================

/*
// Check collections
db.getCollectionNames();

// Count documents in each collection
db.users.countDocuments();
db.behavioral_tokens.countDocuments();
db.performance_tokens.countDocuments();
db.gameplay_tokens.countDocuments();
db.rules.countDocuments();
db.insights.countDocuments();

// View sample data
db.users.find().pretty();
db.rules.find().pretty();
*/

module.exports = {
  collections: [
    'users',
    'behavioral_tokens',
    'performance_tokens',
    'gameplay_tokens',
    'rules',
    'insights',
    'analysis_logs'
  ]
};
