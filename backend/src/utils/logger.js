const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    }) + '\n';
  }

  writeToFile(filename, content) {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, content);
  }

  info(message, meta = {}) {
    const logMessage = this.formatMessage('INFO', message, meta);
    console.log(logMessage.trim());
    
    if (process.env.NODE_ENV === 'production') {
      this.writeToFile('app.log', logMessage);
    }
  }

  error(message, error = null, meta = {}) {
    const errorMeta = error ? {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      ...meta
    } : meta;

    const logMessage = this.formatMessage('ERROR', message, errorMeta);
    console.error(logMessage.trim());
    
    if (process.env.NODE_ENV === 'production') {
      this.writeToFile('error.log', logMessage);
    }
  }

  warn(message, meta = {}) {
    const logMessage = this.formatMessage('WARN', message, meta);
    console.warn(logMessage.trim());
    
    if (process.env.NODE_ENV === 'production') {
      this.writeToFile('app.log', logMessage);
    }
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = this.formatMessage('DEBUG', message, meta);
      console.debug(logMessage.trim());
    }
  }
}

module.exports = new Logger();