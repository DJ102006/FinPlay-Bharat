/**
 * EXPRESS SERVER
 * REST API for Analysis Engine
 * Endpoints for analysis, rules management, and results
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') });
const logger = require('./logger');
const DatabaseManager = require('./database');
const AnalysisEngine = require('./analysisEngine');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Global instances
let db = null;
let engine = null;

/**
 * Middleware for logging requests
 */
app.use((req, res, next) => {
  logger.log(`📨 ${req.method} ${req.path}`);
  next();
});

/**
 * Health Check Endpoint
 */
app.get('/api/health', async (req, res) => {
  try {
    const isHealthy = await db.healthCheck();
    res.status(200).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      engine: 'Analysis Engine v1.0',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

/**
 * GET /api/stats
 * Get engine statistics and performance metrics
 */
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await engine.getEngineStats(db);
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching stats:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analyze/:userId
 * Analyze a user and generate insights
 */
app.get('/api/analyze/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    logger.log(`🔍 Analyzing user: ${userId}`);

    // Fetch user tokens from database
    const userTokens = await db.getUserWithTokens(userId);
    if (!userTokens) {
      return res.status(404).json({
        error: 'User not found.',
      });
    }

    // Run analysis
    const result = await engine.analyzeUser(userId, userTokens, db);
    res.json(result);
  } catch (error) {
    logger.error('Analysis error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/analyze/batch
 * Analyze multiple users
 */
app.post('/api/analyze/batch', async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        error: 'Invalid request. Provide array of userIds.',
      });
    }

    logger.log(`🔍 Batch analyzing ${userIds.length} users`);
    const results = await engine.analyzeMultipleUsers(userIds, db);
    res.json({
      totalUsers: userIds.length,
      analyzedUsers: results.filter(r => r.success).length,
      results,
    });
  } catch (error) {
    logger.error('Batch analysis error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/insights/:userId
 * Get recent insights for a user
 */
app.get('/api/insights/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const insights = await db.getUserInsights(userId, limit);
    res.json({
      userId,
      count: insights.length,
      insights,
    });
  } catch (error) {
    logger.error('Error fetching insights:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/rules
 * Get all active rules
 */
app.get('/api/rules', async (req, res) => {
  try {
    const rules = await db.getActiveRules();
    res.json({
      count: rules.length,
      rules,
    });
  } catch (error) {
    logger.error('Error fetching rules:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/rules
 * Create or update a rule
 */
app.post('/api/rules', async (req, res) => {
  try {
    const rule = req.body;

    // Validate rule structure
    const requiredFields = ['ruleId', 'ruleName', 'condition', 'action', 'priority', 'severity'];
    const missingFields = requiredFields.filter(field => !rule[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    await db.saveRule({
      ...rule,
      isActive: rule.isActive !== false,
      createdAt: rule.createdAt || new Date(),
    });

    // Reload rules in engine
    await engine.rulesEngine.loadRules(db);

    res.json({
      success: true,
      ruleId: rule.ruleId,
      message: 'Rule saved successfully',
    });
  } catch (error) {
    logger.error('Error saving rule:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/tokens/:userId/behavioral
 * Update behavioral tokens
 */
app.put('/api/tokens/:userId/behavioral', async (req, res) => {
  try {
    const { userId } = req.params;
    const tokens = req.body;

    await db.updateBehavioralTokens(userId, tokens);
    res.json({
      success: true,
      userId,
      type: 'behavioral',
      message: 'Behavioral tokens updated',
    });
  } catch (error) {
    logger.error('Error updating behavioral tokens:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/tokens/:userId/performance
 * Update performance tokens
 */
app.put('/api/tokens/:userId/performance', async (req, res) => {
  try {
    const { userId } = req.params;
    const tokens = req.body;

    await db.updatePerformanceTokens(userId, tokens);
    res.json({
      success: true,
      userId,
      type: 'performance',
      message: 'Performance tokens updated',
    });
  } catch (error) {
    logger.error('Error updating performance tokens:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/tokens/:userId/gameplay
 * Update gameplay tokens
 */
app.put('/api/tokens/:userId/gameplay', async (req, res) => {
  try {
    const { userId } = req.params;
    const tokens = req.body;

    await db.updateGameplayTokens(userId, tokens);
    res.json({
      success: true,
      userId,
      type: 'gameplay',
      message: 'Gameplay tokens updated',
    });
  } catch (error) {
    logger.error('Error updating gameplay tokens:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/user/:userId
 * Get user with all tokens
 */
app.get('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userTokens = await db.getUserWithTokens(userId);

    if (!userTokens) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userTokens);
  } catch (error) {
    logger.error('Error fetching user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

/**
 * Start Server
 */
async function startServer() {
  try {
    // Initialize database
    logger.log('🗄️  Initializing database...');
    db = new DatabaseManager(process.env.MONGODB_URI, 'finplay_bharat');
    await db.connect();

    // Initialize analysis engine
    logger.log('🤖 Initializing Analysis Engine...');
    engine = new AnalysisEngine(process.env.OPENROUTER_API_KEY);
    await engine.initialize(db);

    // Start Express server
    app.listen(PORT, () => {
      logger.success(`✅ Server running on http://localhost:${PORT}`);
      logger.log(`📊 API Documentation: http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  logger.warn('Shutting down gracefully...');
  if (db) {
    await db.disconnect();
  }
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
