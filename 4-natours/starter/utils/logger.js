const winston = require('winston');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const logger = winston.createLogger({
  // Log only if level is less than (meaning more severe) or equal to this
  level: 'info',
  // Use timestamp and printf to create a standard log format
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  // Log to the console and a file
  //if (process.env.NODE_ENV === 'development') {
  //transports: [process.env.NODE_ENV === 'development' ? this.consoleLogger : this.stackdriverLogger]
  //transports: [process.env.NODE_ENV === 'development' ? new winston.transports.Console() : new winston.transports.File({ filename: 'logs/proapp.log' })]
  transports: [
    //new winston.transports.Console(),
    //new winston.transports.File({ filename: 'logs/proapp.log' }),
    process.env.NODE_ENV === 'development'
      ? new winston.transports.Console()
      : new winston.transports.File({ filename: 'logs/proapp.log' }),
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});
logger.info(`App is running in ${process.env.NODE_ENV} mode.`);

module.exports = logger;
