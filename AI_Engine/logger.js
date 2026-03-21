/**
 * LOGGER UTILITY
 * Simple logging system for the Analysis Engine
 */

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const LOG_FILE = path.join(LOG_DIR, `analysis-engine-${new Date().toISOString().split('T')[0]}.log`);

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class Logger {
  static log(message, data = '') {
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] ${message} ${data}`;
    console.log(`${colors.blue}${fullMessage}${colors.reset}`);
    this.writeToFile(fullMessage);
  }

  static info(message, data = '') {
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] ℹ️  INFO: ${message} ${data}`;
    console.log(`${colors.cyan}${fullMessage}${colors.reset}`);
    this.writeToFile(fullMessage);
  }

  static success(message, data = '') {
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] ✅ SUCCESS: ${message} ${data}`;
    console.log(`${colors.green}${fullMessage}${colors.reset}`);
    this.writeToFile(fullMessage);
  }

  static warn(message, data = '') {
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] ⚠️  WARNING: ${message} ${data}`;
    console.log(`${colors.yellow}${fullMessage}${colors.reset}`);
    this.writeToFile(fullMessage);
  }

  static error(message, data = '') {
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] ❌ ERROR: ${message} ${data}`;
    console.log(`${colors.red}${fullMessage}${colors.reset}`);
    this.writeToFile(fullMessage);
  }

  static writeToFile(message) {
    try {
      fs.appendFileSync(LOG_FILE, `${message}\n`);
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }
}

module.exports = Logger;
