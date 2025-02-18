import winston from 'winston';

const loggerEnabled: boolean = process.env.LOGGER_ENABLED === 'true'; 

const logger = winston.createLogger({
  level: loggerEnabled ? 'debug' : 'silent', 
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

export default logger;