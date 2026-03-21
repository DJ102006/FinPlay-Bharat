/**
 * MONGODB CONNECTION MANAGER
 * Handles all database operations for the Analysis Engine
 * Features: Connection pooling, error handling, schema validation
 */

const { MongoClient, ObjectId } = require('mongodb');
const logger = require('./logger');
const { resolveMongoConnectionUri } = require('./mongoUri');

class DatabaseManager {
  constructor(mongoUri, dbName = 'finplay_bharat') {
    this.mongoUri = mongoUri;
    this.dbName = dbName;
    this.client = null;
    this.db = null;
    this.collections = {};
  }

  /**
   * Initialize MongoDB connection
   */
  async connect() {
    try {
      const connectionUri = await resolveMongoConnectionUri(this.mongoUri);
      this.client = new MongoClient(connectionUri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        retryWrites: true,
        w: 'majority',
        serverSelectionTimeoutMS: 5000,
      });

      await this.client.connect();
      this.db = await this.resolveDatabase();
      
      // Initialize collections
      this.collections = {
        users: this.db.collection('users'),
        activity: this.db.collection('activity'),
        behavioralTokens: this.db.collection('behavioral_tokens'),
        performanceTokens: this.db.collection('performance_tokens'),
        gameplayTokens: this.db.collection('gameplay_tokens'),
        rules: this.db.collection('rules'),
        insights: this.db.collection('insights'),
        logs: this.db.collection('analysis_logs'),
      };

      // Create indexes for better performance
      await this.createIndexes();

      logger.info('✅ Connected to MongoDB Atlas successfully');
      return true;
    } catch (error) {
      logger.error('❌ MongoDB connection failed:', error.message);
      throw error;
    }
  }

  /**
   * Create database indexes for optimal query performance
   */
  async createIndexes() {
    try {
      // Users indexes
      await this.collections.users.createIndex({ email: 1 });
      await this.collections.users.createIndex({ userId: 1 }, { sparse: true });

      // Activity indexes
      await this.collections.activity.createIndex({ userId: 1, updatedAt: -1 });

      // Tokens indexes
      await this.collections.behavioralTokens.createIndex({ userId: 1 }, { unique: true });
      await this.collections.performanceTokens.createIndex({ userId: 1 }, { unique: true });
      await this.collections.gameplayTokens.createIndex({ userId: 1 }, { unique: true });

      // Rules indexes
      await this.collections.rules.createIndex({ ruleId: 1 }, { unique: true });
      await this.collections.rules.createIndex({ isActive: 1 });

      // Insights indexes
      await this.collections.insights.createIndex({ userId: 1 });
      await this.collections.insights.createIndex({ createdAt: -1 });
      await this.collections.insights.createIndex({ userId: 1, createdAt: -1 });

      logger.info('✅ Database indexes created');
    } catch (error) {
      logger.warn('⚠️ Index creation warning:', error.message);
    }
  }

  /**
   * Fetch user with all token data
   */
  async getUserWithTokens(userId) {
    try {
      const user = await this.findUser(userId);
      if (!user) return null;

      const activity = await this.getUserActivity(userId, user._id);
      const derivedTokens = this.deriveTokensFromActivity(user, activity);
      const userKey = this.getUserKey(user);

      const tokens = {
        user,
        activity,
        activitySummary: derivedTokens.activitySummary,
        behavioral: {
          ...derivedTokens.behavioral,
          ...(await this.collections.behavioralTokens.findOne({ userId: userKey })),
        },
        performance: {
          ...derivedTokens.performance,
          ...(await this.collections.performanceTokens.findOne({ userId: userKey })),
        },
        gameplay: {
          ...derivedTokens.gameplay,
          ...(await this.collections.gameplayTokens.findOne({ userId: userKey })),
        },
      };

      return tokens;
    } catch (error) {
      logger.error(`Error fetching user ${userId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get all active rules
   */
  async getActiveRules() {
    try {
      return await this.collections.rules
        .find({ isActive: true })
        .toArray();
    } catch (error) {
      logger.error('Error fetching rules:', error.message);
      throw error;
    }
  }

  /**
   * Save analysis insight to database
   */
  async saveInsight(userId, insight) {
    try {
      const result = await this.collections.insights.insertOne({
        userId,
        ...insight,
        createdAt: new Date(),
      });

      logger.info(`✅ Insight saved for user ${userId}`);
      return result.insertedId;
    } catch (error) {
      logger.error('Error saving insight:', error.message);
      throw error;
    }
  }

  /**
   * Get recent insights for user
   */
  async getUserInsights(userId, limit = 10) {
    try {
      return await this.collections.insights
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      logger.error(`Error fetching insights for ${userId}:`, error.message);
      throw error;
    }
  }

  /**
   * Create or update a rule
   */
  async saveRule(rule) {
    try {
      const result = await this.collections.rules.updateOne(
        { ruleId: rule.ruleId },
        { $set: rule },
        { upsert: true }
      );
      logger.info(`✅ Rule ${rule.ruleId} saved`);
      return result;
    } catch (error) {
      logger.error('Error saving rule:', error.message);
      throw error;
    }
  }

  /**
   * Update user behavioral tokens
   */
  async updateBehavioralTokens(userId, tokens) {
    try {
      const user = await this.findUser(userId);
      const userKey = user ? this.getUserKey(user) : userId;
      const result = await this.collections.behavioralTokens.updateOne(
        { userId: userKey },
        { $set: { userId: userKey, ...tokens, updatedAt: new Date() } },
        { upsert: true }
      );
      return result;
    } catch (error) {
      logger.error(`Error updating behavioral tokens for ${userId}:`, error.message);
      throw error;
    }
  }

  /**
   * Update user performance tokens
   */
  async updatePerformanceTokens(userId, tokens) {
    try {
      const user = await this.findUser(userId);
      const userKey = user ? this.getUserKey(user) : userId;
      const result = await this.collections.performanceTokens.updateOne(
        { userId: userKey },
        { $set: { userId: userKey, ...tokens, updatedAt: new Date() } },
        { upsert: true }
      );
      return result;
    } catch (error) {
      logger.error(`Error updating performance tokens for ${userId}:`, error.message);
      throw error;
    }
  }

  /**
   * Update user gameplay tokens
   */
  async updateGameplayTokens(userId, tokens) {
    try {
      const user = await this.findUser(userId);
      const userKey = user ? this.getUserKey(user) : userId;
      const result = await this.collections.gameplayTokens.updateOne(
        { userId: userKey },
        { $set: { userId: userKey, ...tokens, updatedAt: new Date() } },
        { upsert: true }
      );
      return result;
    } catch (error) {
      logger.error(`Error updating gameplay tokens for ${userId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get statistics for dashboard
   */
  async getEngineStats() {
    try {
      const stats = {
        totalUsers: await this.collections.users.countDocuments(),
        totalRules: await this.collections.rules.countDocuments(),
        activeRules: await this.collections.rules.countDocuments({ isActive: true }),
        totalInsights: await this.collections.insights.countDocuments(),
        insightsToday: await this.collections.insights.countDocuments({
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }),
      };
      return stats;
    } catch (error) {
      logger.error('Error fetching engine stats:', error.message);
      throw error;
    }
  }

  /**
   * Log analysis execution
   */
  async logAnalysis(userId, ruleId, result) {
    try {
      await this.collections.logs.insertOne({
        userId,
        ruleId,
        result,
        executedAt: new Date(),
      });
    } catch (error) {
      logger.warn('Error logging analysis:', error.message);
    }
  }

  /**
   * Close MongoDB connection
   */
  async disconnect() {
    try {
      if (this.client) {
        await this.client.close();
        logger.info('✅ MongoDB connection closed');
      }
    } catch (error) {
      logger.error('Error closing connection:', error.message);
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const admin = this.db.admin();
      await admin.ping();
      return true;
    } catch (error) {
      logger.error('Health check failed:', error.message);
      return false;
    }
  }

  async resolveDatabase() {
    const preferredDb = this.client.db(this.dbName);
    const preferredUsersCollection = preferredDb.collection('users');
    const preferredUserCount = await preferredUsersCollection.countDocuments({}, { limit: 1 });

    if (this.dbName === 'finplay_bharat') {
      return preferredDb;
    }

    const fallbackDb = this.client.db('finplay_bharat');
    const fallbackUserCount = await fallbackDb.collection('users').countDocuments({}, { limit: 1 });

    if (preferredUserCount === 0 && fallbackUserCount > 0) {
      logger.warn(`⚠️ Preferred database "${this.dbName}" has no live users. Falling back to "finplay_bharat".`);
      this.dbName = 'finplay_bharat';
      return fallbackDb;
    }

    return preferredDb;
  }

  async findUser(userId) {
    const filters = [{ userId }];

    if (ObjectId.isValid(userId)) {
      filters.push({ _id: new ObjectId(userId) });
    }

    return this.collections.users.findOne({ $or: filters });
  }

  async getUserActivity(userId, objectId = null) {
    const filters = [{ userId }];

    if (objectId) {
      filters.push({ userId: objectId });
    } else if (ObjectId.isValid(userId)) {
      filters.push({ userId: new ObjectId(userId) });
    }

    return this.collections.activity
      .find({ $or: filters })
      .sort({ updatedAt: -1 })
      .toArray();
  }

  getUserKey(user) {
    return user.userId || user._id.toString();
  }

  deriveTokensFromActivity(user, activity) {
    const completedActivity = activity.filter((item) => item.progress === 'Completed');
    const averageScore = completedActivity.length > 0
      ? completedActivity.reduce((sum, item) => sum + (Number(item.score) || 0), 0) / completedActivity.length
      : 0;
    const activityByGame = completedActivity.reduce((acc, item) => {
      acc[item.gameType] = acc[item.gameType] || [];
      acc[item.gameType].push(Number(item.score) || 0);
      return acc;
    }, {});
    const repeatCount = Object.values(activityByGame).filter((scores) => scores.length > 1).length;
    const weakestModule = this.getWeakestModule(activityByGame);
    const completedModules = Object.keys(activityByGame);
    const completedCount = completedActivity.length;
    const completedAdvance = completedModules.some((name) => /advance|stock|investment/i.test(name));
    const completedGrowth = completedModules.some((name) => /growth|budget/i.test(name));
    const completedEssential = completedModules.some((name) => /essential|credit|debt/i.test(name));
    const lastActivityAt = activity[0]?.updatedAt || user.lastLogin || user.createdAt || new Date();

    return {
      activitySummary: {
        totalActivities: activity.length,
        completedActivities: completedCount,
        averageScore: Number(averageScore.toFixed(2)),
        completedModules,
        weakestModule,
        lastActivityAt,
      },
      behavioral: {
        attention_span: averageScore >= 85 ? 'high' : averageScore >= 60 ? 'medium' : 'low_fragmented',
        engagement_style: completedCount >= 2 ? 'video_watcher' : 'reader',
        risk_profile: completedAdvance || completedGrowth ? 'moderate' : 'conservative',
        decision_speed: repeatCount > 0 ? 'deliberate' : 'fast',
        learning_pace: averageScore >= 85 ? 'quick_learner' : averageScore >= 60 ? 'average' : 'struggling',
      },
      performance: {
        quiz_accuracy: Number(averageScore.toFixed(2)),
        retry_frequency: repeatCount > 1 ? 'high' : repeatCount === 1 ? 'medium' : 'low',
        knowledge_gap: weakestModule,
        application_score: averageScore >= 80 ? 'high' : averageScore >= 60 ? 'medium' : 'low',
        concept_retention: Number(Math.max(30, Math.min(100, averageScore)).toFixed(2)),
        time_spent_minutes: completedCount * 20,
      },
      gameplay: {
        asset_allocation: completedAdvance || completedGrowth ? 'diversified' : '100%_savings_account',
        market_reaction: averageScore >= 75 ? 'hold' : 'panic_sell',
        budget_adherence: completedEssential ? 'good' : averageScore >= 70 ? 'fair' : 'poor',
        risk_taking_behavior: completedAdvance ? 'calculated_risk' : 'avoids_all_risk',
        emergency_fund_status: completedEssential ? 'adequate' : 'partial',
        investment_discipline: completedCount >= 3 ? 'high' : completedCount >= 1 ? 'medium' : 'low',
      },
    };
  }

  getWeakestModule(activityByGame) {
    const moduleAverages = Object.entries(activityByGame).map(([name, scores]) => ({
      name,
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    }));

    if (moduleAverages.length === 0) {
      return 'foundational_financial_literacy';
    }

    moduleAverages.sort((left, right) => left.average - right.average);
    const weakest = moduleAverages[0].name.toLowerCase();

    if (weakest.includes('security') || weakest.includes('fraud')) return 'fraud_detection';
    if (weakest.includes('essential') || weakest.includes('credit') || weakest.includes('debt')) return 'credit_and_debt_management';
    if (weakest.includes('growth') || weakest.includes('budget')) return 'budgeting_and_compounding';
    if (weakest.includes('advance') || weakest.includes('stock')) return 'stock_market_basics';

    return 'foundational_financial_literacy';
  }
}

module.exports = DatabaseManager;
