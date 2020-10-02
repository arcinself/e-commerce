const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({
            filename: 'error.log',
            level: 'error',
            options: {
                flags: 'w'
            }
        }),
        new winston.transports.File({
            filename: 'logs.log',
            level: 'info',
            options: {
                flags: 'w'
            }
        }),
    ],
});

module.exports = logger