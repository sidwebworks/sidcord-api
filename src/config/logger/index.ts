import morgan, { StreamOptions } from 'morgan'
import { Logger } from 'winston'

import { buildDevLogger } from './dev-logger'
import { buildProdLogger } from './prod-logger'

let logger: Logger

if (process.env.NODE_ENV === 'development') {
    logger = buildDevLogger()
} else {
    logger = buildProdLogger()
}

export default logger

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
    // Use the http severity
    write: (message) => logger.info(message),
}

export const httpLogger = morgan(
    // Define message format string (this is the default one).
    // The message format is made from tokens, and each token is
    // defined inside the Morgan library.
    // You can create your custom token to show what do you want from a request.
    ':method :url :status :res[content-length] - :response-time ms',
    // Options: in this case, I overwrote the stream and the skip logic.
    // See the methods above.
    { stream }
)
