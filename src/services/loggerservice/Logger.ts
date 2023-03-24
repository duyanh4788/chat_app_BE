import winston from 'winston';

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({
            filename: `./src/logger/${new Date().getFullYear()}/${new Date().getMonth() + 1
                }/${new Date().getDate()}/error.log`,
            level: 'error'
        }),
        new winston.transports.File({
            filename: `./src/logger/${new Date().getFullYear()}/${new Date().getMonth() + 1
                }/${new Date().getDate()}/combined.log`
        })
    ]
});