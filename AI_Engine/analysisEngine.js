/**
 * ANALYSIS ENGINE
 * Core AI-powered insight generator
 * Integrates with OpenRouter API for Claude/GPT responses
 */

const axios = require('axios');
const logger = require('./logger');
const RulesEngine = require('./rulesEngine');

class AnalysisEngine {
  constructor(openrouterApiKey, modelName = null) {
    this.apiKey = openrouterApiKey;
    this.model = modelName || process.env.DEFAULT_MODEL || 'openai/gpt-3.5-turbo'; // Use env variable or user selected model
    this.rulesEngine = new RulesEngine();
    this.systemPrompt = this.buildSystemPrompt();
  }

  /**
   * Build master system prompt for Financial Counselor
   */
  buildSystemPrompt() {
    return `You are a professional Financial Advisor and Counselor specializing in Indian finance. Your goal is to provide meticulous, articulate, and forward-thinking financial guidance to Indian users.

TONE & STYLE:
- Professional, grounded, authoritative (like a top financial blog post)
- Data-driven and logic-focused
- No fluff, direct and actionable
- Hindi/English mix acceptable for Indian context

CONTEXT:
- Indian financial concepts only: SIP, FD, PPF, GST, Indian inflation, rupee trends
- Tax implications for Indian residents
- Government schemes (Pradhan Mantri Yojana, etc.)
- Indian market behavior and investor psychology

ANALYSIS APPROACH:
- Analyze user's Behavioral Tokens: How they learn, their risk profile, engagement patterns
- Analyze Performance Tokens: Quiz accuracy, knowledge gaps, concept retention
- Analyze Gameplay Tokens: Asset allocation choices, market reaction, budget discipline
- Identify logical gaps and weak premises
- Challenge incorrect financial assumptions directly

OUTPUT FORMAT:
You MUST respond with a JSON object (and ONLY JSON, no other text):
{
  "title": "Brief insight title (max 10 words)",
  "severity": "critical|high|medium|low|info",
  "category": "risk|learning|behavior|application|growth",
  "mainInsight": "The core finding in 2-3 sentences",
  "analysis": "Detailed analysis paragraph with specific observations",
  "triggeredRules": ["rule_name_1", "rule_name_2"],
  "recommendations": [
    "First actionable recommendation",
    "Second actionable recommendation",
    "Third actionable recommendation"
  ],
  "nextSteps": "What user should do immediately",
  "reasoning": "Why this insight matters for their financial growth"
}

NEVER:
- Ask for personal financial data
- Make assumptions without evidence from tokens
- Soften recommendations that are logically necessary
- Use generic advice`;
  }

  /**
   * Initialize engine with database and load rules
   */
  async initialize(database) {
    try {
      await this.rulesEngine.loadRules(database);
      logger.info('✅ Analysis Engine initialized');
      return true;
    } catch (error) {
      logger.error('Error initializing Analysis Engine:', error.message);
      throw error;
    }
  }

  /**
   * Analyze a user's tokens and generate insights
   */
  async analyzeUser(userId, userTokens, database) {
    try {
      logger.log(`🔍 Starting analysis for user: ${userId}`);

      // Step 1: Evaluate rules
      const triggeredRules = await this.rulesEngine.evaluateRules(userTokens);
      logger.info(`📋 Triggered ${triggeredRules.length} rules`);

      // Step 2: Build analysis context
      const context = this.buildAnalysisContext(userTokens, triggeredRules);

      // Step 3: Call AI API with local fallback
      let aiInsight;
      try {
        aiInsight = this.apiKey
          ? await this.callOpenRouterAPI(context)
          : this.buildFallbackInsight(userTokens, triggeredRules);
      } catch (error) {
        logger.warn(`⚠️ Falling back to local insight generation: ${error.message}`);
        aiInsight = this.buildFallbackInsight(userTokens, triggeredRules);
      }
      const recommendedPath = this.getRecommendedPath(userTokens, aiInsight, triggeredRules);

      // Step 4: Save insight
      const insightId = await database.saveInsight(userId, {
        triggeredRules: triggeredRules.map(r => r.ruleId),
        tokenSnapshot: {
          behavioral: userTokens.behavioral,
          performance: userTokens.performance,
          gameplay: userTokens.gameplay,
        },
        insight: aiInsight,
        severity: aiInsight.severity,
        category: aiInsight.category,
        recommendedPath,
      });

      // Step 5: Log execution
      await database.logAnalysis(userId, 'multi_rule_analysis', {
        success: true,
        insightId,
        ruleCount: triggeredRules.length,
      });

      logger.success(`✅ Analysis complete for user ${userId}`);

      return {
        userId,
        insightId,
        triggeredRules: triggeredRules.map(r => r.ruleName),
        severity: aiInsight.severity,
        recommendedPath,
        analysis: aiInsight,
        success: true,
      };
    } catch (error) {
      logger.error(`Error analyzing user ${userId}:`, error.message);
      throw error;
    }
  }

  /**
   * Build context string for AI analysis
   */
  buildAnalysisContext(userTokens, triggeredRules) {
    const rulesText = triggeredRules
      .map(r => `- ${r.ruleName} (Priority: ${r.priority}, Severity: ${r.severity})`)
      .join('\n');

    return `
TRIGGERED RULES:
${rulesText}

USER BEHAVIORAL TOKENS:
${JSON.stringify(userTokens.behavioral, null, 2)}

USER PERFORMANCE TOKENS:
${JSON.stringify(userTokens.performance, null, 2)}

USER GAMEPLAY TOKENS:
${JSON.stringify(userTokens.gameplay, null, 2)}

USER ACTIVITY SUMMARY:
${JSON.stringify(userTokens.activitySummary || {}, null, 2)}

TASK:
Based on the triggered rules and user tokens above, provide a comprehensive financial insight and recommendations. Focus on the triggered rules and explain how the token values support or contradict sound financial principles.

Remember: Be direct, data-driven, and actionable. Challenge weak financial assumptions.`;
  }

  /**
   * Call OpenRouter API (compatible with Claude, GPT, etc.)
   */
  async callOpenRouterAPI(context) {
    try {
      logger.log('📡 Calling OpenRouter API...');

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.systemPrompt,
            },
            {
              role: 'user',
              content: context,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://finplay-bharat.com',
            'X-Title': 'FinPlay Bharat Analysis Engine',
          },
          timeout: 30000,
        }
      );

      const responseText = response.data.choices[0].message.content;
      logger.log('📝 API Response received');

      // Parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in API response');
      }

      const insight = JSON.parse(jsonMatch[0]);
      logger.success('✅ API response parsed successfully');

      return insight;
    } catch (error) {
      logger.error('❌ OpenRouter API error:', error.message);
      throw error;
    }
  }

  /**
   * Batch analyze multiple users
   */
  async analyzeMultipleUsers(userIds, database) {
    const results = [];

    for (const userId of userIds) {
      try {
        const userTokens = await database.getUserWithTokens(userId);
        if (userTokens) {
          const result = await this.analyzeUser(userId, userTokens, database);
          results.push(result);
        }
      } catch (error) {
        logger.error(`Failed to analyze user ${userId}:`, error.message);
        results.push({
          userId,
          error: error.message,
          success: false,
        });
      }
    }

    return results;
  }

  /**
   * Set custom model (e.g., 'anthropic/claude-3-sonnet')
   */
  setModel(modelName) {
    this.model = modelName;
    logger.info(`✅ Model set to: ${modelName}`);
  }

  /**
   * Get engine statistics
   */
  async getEngineStats(database) {
    try {
      const stats = await database.getEngineStats();
      return {
        ...stats,
        loadedRules: this.rulesEngine.rules.length,
        triggeredRulesLastRun: this.rulesEngine.triggeredRules.length,
      };
    } catch (error) {
      logger.error('Error getting engine stats:', error.message);
      return null;
    }
  }

  buildFallbackInsight(userTokens, triggeredRules) {
    const activitySummary = userTokens.activitySummary || {};
    const highestSeverity = this.getHighestSeverity(triggeredRules);
    const category = highestSeverity === 'critical'
      ? 'application'
      : highestSeverity === 'high'
        ? 'risk'
        : userTokens.performance?.application_score === 'low'
          ? 'learning'
          : 'growth';
    const weakestModule = userTokens.performance?.knowledge_gap || 'foundational_financial_literacy';
    const completedCount = activitySummary.completedActivities || 0;
    const averageScore = userTokens.performance?.quiz_accuracy || 0;
    const title = completedCount === 0
      ? 'Start Building Your Learning Profile'
      : averageScore >= 80
        ? 'Strong Progress With Next-Step Opportunity'
        : 'Adaptive Review Recommended';
    const mainInsight = completedCount === 0
      ? 'We do not have enough completed learning activity yet to build a deep AI profile. Finish at least one hub quiz so the adaptive engine can personalise your path.'
      : `Your adaptive profile is based on ${completedCount} completed activity records with an average score of ${averageScore.toFixed(0)}%. The biggest improvement area right now is ${weakestModule.replace(/_/g, ' ')}.`;
    const recommendations = this.buildRecommendations(weakestModule, completedCount);

    return {
      title,
      severity: highestSeverity,
      category,
      mainInsight,
      analysis: `The adaptive engine used live user activity from the main FinPlay database to derive behavioral, performance, and gameplay signals. Triggered rules: ${triggeredRules.map(rule => rule.ruleName).join(', ') || 'none'}.`,
      triggeredRules: triggeredRules.map(rule => rule.ruleName),
      recommendations,
      nextSteps: recommendations[0],
      reasoning: 'This recommendation is grounded in your actual completion history and quiz scores, not in demo-only placeholder data.',
    };
  }

  buildRecommendations(weakestModule, completedCount) {
    if (completedCount === 0) {
      return [
        'Complete one learning hub quiz to generate your first adaptive profile.',
        'Aim for at least 70% on the certification test so the engine has meaningful performance data.',
        'Return to the Adaptive Learning page after your first completion.',
      ];
    }

    if (weakestModule === 'fraud_detection') {
      return [
        'Retake the Security & Fraud Detection hub and focus on scam-identification concepts.',
        'Review OTP, phishing, and UPI safety examples before attempting the quiz again.',
        'Complete one more security activity to improve confidence and retention.',
      ];
    }

    if (weakestModule === 'credit_and_debt_management') {
      return [
        'Revisit the Essential Credit & Debt Management hub to strengthen core credit habits.',
        'Focus on credit score, EMI discipline, and debt-to-income concepts.',
        'Take the quiz again after reviewing the lowest-scoring topics.',
      ];
    }

    if (weakestModule === 'stock_market_basics' || weakestModule === 'budgeting_and_compounding') {
      return [
        'Continue into the Growth or Advance hub to convert theory into stronger application.',
        'Pay special attention to compounding, diversification, and disciplined investing concepts.',
        'Use repeat practice to turn moderate scores into consistent high performance.',
      ];
    }

    return [
      'Complete another hub to expand the behavioral data available for adaptive recommendations.',
      'Aim to improve your average quiz score by revisiting the topics you found hardest.',
      'Use the recommended learning path to build balanced financial literacy across modules.',
    ];
  }

  getHighestSeverity(triggeredRules) {
    const ranking = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
    return triggeredRules.reduce((current, rule) => (
      (ranking[rule.severity] ?? 0) > (ranking[current] ?? 0) ? rule.severity : current
    ), 'info');
  }

  getRecommendedPath(userTokens, aiInsight, triggeredRules) {
    const knowledgeGap = userTokens.performance?.knowledge_gap || '';
    const ruleText = triggeredRules.map((rule) => `${rule.ruleName} ${rule.action}`).join(' ').toLowerCase();
    const category = (aiInsight.category || '').toLowerCase();

    if (knowledgeGap.includes('fraud') || (category === 'risk' && ruleText.includes('fraud'))) {
      return '/hub/security';
    }

    if (knowledgeGap.includes('credit') || knowledgeGap.includes('debt')) {
      return '/hub/essential';
    }

    if (knowledgeGap.includes('stock') || ruleText.includes('investment')) {
      return '/hub/advance';
    }

    if (knowledgeGap.includes('budget') || knowledgeGap.includes('compound') || category === 'growth') {
      return '/hub/growth';
    }

    const averageScore = userTokens.performance?.quiz_accuracy || 0;
    return averageScore >= 80 ? '/hub/advance' : '/hub/growth';
  }
}

module.exports = AnalysisEngine;
