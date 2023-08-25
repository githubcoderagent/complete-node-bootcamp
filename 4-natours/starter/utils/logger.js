const winston = require('winston');
//const dotenv = require('dotenv');

//dotenv.config({ path: './config.env' });

const logger = winston.createLogger({
  // Log only if level is less than (meaning more severe) or equal to this
  level: 'info',
  // Use timestamp and printf to create a standard log format
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level} ${info.message}`,
    ),
    //winston.format.uncolorize(),
  ),
  // Log to the console and a file
  //if (process.env.NODE_ENV === 'development') {
  //transports: [process.env.NODE_ENV === 'development' ? this.consoleLogger : this.stackdriverLogger]
  //transports: [process.env.NODE_ENV === 'development' ? new winston.transports.Console() : new winston.transports.File({ filename: 'logs/proapp.log' })]
  transports: [
    //new winston.transports.Console(),
    //new winston.transports.File({ filename: 'logs/proapp.log' }),
    process.env.NODE_ENV === 'development'
      ? new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              (info) => `${info.timestamp} ${info.level} ${info.message}`,
            ),
          ),
        })
      : new winston.transports.File({
          filename: 'logs/proapp.log',
          level: 'info',
          maxsize: 10000000,
          maxFiles: 5,
          tailable: true,
          format: winston.format.combine(
            winston.format.uncolorize(),
            //winston.format.json(),
          ),
        }),
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level} ${info.message}`,
        ),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/app.log',
      level: 'info',
      //format: winston.format.uncolorize(),
      maxsize: 1000000,
      maxFiles: 5,
      tailable: true,
      //showLevel: true,
      format: winston.format.combine(
        winston.format.uncolorize(),
        //winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/app_debug.log',
      level: 'debug',
      maxsize: 1000000,
      maxFiles: 5,
      tailable: true,
      //showLevel: true,
      format: winston.format.combine(
        winston.format.uncolorize(),
        //winston.format.json(),
      ),
    }),
    // new winston.transports.File({
    //   filename: 'logs/app_verbose.log',
    //   level: 'verbose',
    //   maxsize: 1000000,
    //   maxFiles: 5,
    //   tailable: true,
    //   format: winston.format.combine(winston.format.uncolorize()),
    // }),
    // new winston.transports.File({
    //   filename: 'logs/app_http.log',
    //   level: 'http',
    //   maxsize: 1000000,
    //   maxFiles: 5,
    //   tailable: true,
    //   format: winston.format.combine(winston.format.uncolorize()),
    // }),
    // new winston.transports.File({
    //   filename: 'logs/app_info.log',
    //   level: 'info',
    //   maxsize: 1000000,
    //   maxFiles: 5,
    //   tailable: true,
    //   format: winston.format.combine(winston.format.uncolorize()),
    // }),
    new winston.transports.File({
      filename: 'logs/app_warn.log',
      level: 'warn',
      maxsize: 1000000,
      maxFiles: 5,
      tailable: true,
      format: winston.format.combine(winston.format.uncolorize()),
    }),
    new winston.transports.File({
      filename: 'logs/app_error.log',
      level: 'error',
      maxsize: 1000000,
      maxFiles: 5,
      tailable: true,
      format: winston.format.combine(winston.format.uncolorize()),
    }),
    new winston.transports.File({
      filename: 'logs/sillyapp_json.log',
      level: 'silly',
      maxsize: 10000000,
      maxFiles: 5,
      tailable: true,
      //showLevel: true,
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/sillyapp.log',
      level: 'silly',
      maxsize: 10000000,
      maxFiles: 5,
      tailable: true,
      //showLevel: true,
      format: winston.format.combine(
        winston.format.uncolorize(),
        //winston.format.json(),
      ),
    }),
  ],
});
logger.debug(`App is running in ${process.env.NODE_ENV} mode.`);

module.exports = logger;
