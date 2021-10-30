import mongoose from 'mongoose'

import logger from '../logger'

const connect = async () => {
    if (process.env.NODE_ENV !== 'production') {
        // Turn on mongoose logging in development
        mongoose.set('debug', true)
    }

    // Connect to Prod DB using Production creds
    await mongoose
        .connect(process.env.DB_URL || '', {
            autoIndex: process.env.NODE_ENV !== 'production',
        })
        .then((db: any) => {
            logger.info(`DB Connection Success to: ${db.connection.name}`)
        })
        .catch((err) => {
            logger.error(err.message)
        })
}

export default connect
