import { format, createLogger, transports } from 'winston'
const { timestamp, combine, json, errors } = format

export const buildProdLogger = () => {
    return createLogger({
        format: combine(timestamp(), errors({ stack: true }), json()),
        transports: [
            new transports.Console(),
            new transports.File({
                filename: 'logs/error.log',
                level: 'error',
            }),
            // Allow to print all the error message inside the all.log file
            // (also the error log that are also printed inside the error.log(
            new transports.File({ filename: 'logs/all.log' }),
        ],
      
    })
}
