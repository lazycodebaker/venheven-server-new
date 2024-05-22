
import winston from 'winston';
import { settings } from '../config/settings';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
}

const logger = winston.createLogger({
    levels: levels,
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: settings.logs.WARN_FILE, level: 'warn', format: winston.format.json() }),
        new winston.transports.File({ filename: settings.logs.ERROR_FILE, level: 'error', format: winston.format.json() }),
        new winston.transports.File({ filename: settings.logs.INFO_FILE, level: 'info', format: winston.format.json() }),
        new winston.transports.Console({ level: 'debug', format: winston.format.json() })
    ]
});
 

export default logger;