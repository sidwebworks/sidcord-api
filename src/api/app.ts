import express, { RequestHandler } from 'express'
import init from '../config/loaders/express.loader'
import userRouter from './routes/user.routes'
import ErrorMiddleware from './middlewares/error.middleware'
import createError from 'http-errors'

const app = init(express())

app.use('/users', userRouter)

/**
 * Capture unhandled Routes
 */
app.all<RequestHandler>('*', (req, res, next) => {
    return next(createError(404, `Can't find ${req.originalUrl} on this server.`))
})

app.use(ErrorMiddleware)

export default app
