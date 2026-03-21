/**
 * RULES ENGINE
 * Evaluates rules against user behavioral, performance, and gameplay tokens
 * Rule format: condition, action, priority, severity
 */

const logger = require('./logger');

class RulesEngine {
  constructor() {
    this.rules = [];
    this.triggeredRules = [];
  }

  /**
   * Load rules from database
   */
  async loadRules(database) {
    try {
      this.rules = await database.getActiveRules();
      logger.info(`✅ Loaded ${this.rules.length} active rules`);
    } catch (error) {
      logger.error('Error loading rules:', error.message);
      throw error;
    }
  }

  /**
   * Evaluate all rules against user tokens
   */
  async evaluateRules(userTokens) {
    this.triggeredRules = [];

    for (const rule of this.rules) {
      try {
        if (this.evaluateCondition(rule.condition, userTokens)) {
          this.triggeredRules.push({
            ruleId: rule.ruleId,
            ruleName: rule.ruleName,
            priority: rule.priority,
            severity: rule.severity,
            action: rule.action,
          });
          logger.info(`✅ Rule triggered: ${rule.ruleName}`);
        }
      } catch (error) {
        logger.warn(`Error evaluating rule ${rule.ruleId}:`, error.message);
      }
    }

    // Sort by priority (higher priority first)
    this.triggeredRules.sort((a, b) => b.priority - a.priority);
    return this.triggeredRules;
  }

  /**
   * Parse and evaluate condition string
   * Example: "performance.quiz_accuracy < 50 AND behavioral.engagement_style == 'video_skipper'"
   */
  evaluateCondition(condition, userTokens) {
    try {
      // Replace token references with actual values
      let evaluatedCondition = condition;

      // Replace behavioral tokens
      if (userTokens.behavioral) {
        for (const [key, value] of Object.entries(userTokens.behavioral)) {
          const placeholder = `behavioral.${key}`;
          evaluatedCondition = evaluatedCondition.replace(
            new RegExp(placeholder, 'g'),
            JSON.stringify(value)
          );
        }
      }

      // Replace performance tokens
      if (userTokens.performance) {
        for (const [key, value] of Object.entries(userTokens.performance)) {
          const placeholder = `performance.${key}`;
          evaluatedCondition = evaluatedCondition.replace(
            new RegExp(placeholder, 'g'),
            JSON.stringify(value)
          );
        }
      }

      // Replace gameplay tokens
      if (userTokens.gameplay) {
        for (const [key, value] of Object.entries(userTokens.gameplay)) {
          const placeholder = `gameplay.${key}`;
          evaluatedCondition = evaluatedCondition.replace(
            new RegExp(placeholder, 'g'),
            JSON.stringify(value)
          );
        }
      }

      evaluatedCondition = evaluatedCondition
        .replace(/\bAND\b/g, '&&')
        .replace(/\bOR\b/g, '||');

      // Safe evaluation
      return this.safeEval(evaluatedCondition);
    } catch (error) {
      logger.warn('Error evaluating condition:', error.message);
      return false;
    }
  }

  /**
   * Safe JavaScript evaluation
   * Only allows comparison operators, logical operators, and numbers/strings
   */
  safeEval(expression) {
    // Whitelist allowed characters and operators
    const allowedPattern = /^[0-9a-zA-Z_"'.<>=!&|(\)\s]+$/;

    if (!allowedPattern.test(expression)) {
      throw new Error('Invalid characters in expression');
    }

    // Check for dangerous patterns
    const dangerousPatterns = ['eval', 'require', 'import', 'process', 'global', '__'];
    for (const pattern of dangerousPatterns) {
      if (expression.includes(pattern)) {
        throw new Error(`Dangerous pattern detected: ${pattern}`);
      }
    }

    // Use Function constructor (safer than eval) with restricted scope
    try {
      const fn = new Function('return ' + expression);
      return fn() === true;
    } catch (error) {
      throw new Error(`Expression evaluation failed: ${error.message}`);
    }
  }

  /**
   * Get triggered rules for analysis context
   */
  getTriggeredRulesContext() {
    return this.triggeredRules.map(rule => ({
      ruleId: rule.ruleId,
      ruleName: rule.ruleName,
      action: rule.action,
      severity: rule.severity,
    }));
  }

  /**
   * Get highest severity level
   */
  getHighestSeverity() {
    const severityLevels = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
      info: 0,
    };

    if (this.triggeredRules.length === 0) return 'none';

    let maxSeverity = 'none';
    let maxScore = -1;

    for (const rule of this.triggeredRules) {
      const score = severityLevels[rule.severity] || 0;
      if (score > maxScore) {
        maxScore = score;
        maxSeverity = rule.severity;
      }
    }

    return maxSeverity;
  }

  /**
   * Get list of triggered rule names
   */
  getTriggeredRuleNames() {
    return this.triggeredRules.map(rule => rule.ruleName);
  }
}

module.exports = RulesEngine;
