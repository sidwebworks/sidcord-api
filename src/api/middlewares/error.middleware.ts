import { NextFunction, Request, Response } from 'express'
import { HttpError } from 'http-errors'
import logger from '../../config/logger'

/**
 * Show full errors during development using
 * ?`handleDevError` function
 */
const handleDevError = (err: HttpError, res: Response) => {
    logger.error(err.message)

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        trace: err.stack,
    })
}

/**
 *  Hide error details during production using
 * ?`handleProdError` function
 */
const handleProdError = (err: HttpError, res: Response): Response | void => {
    logger.error(err.message)
    
    if (err.expose) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }
    res.status(500).json({
        status: 'error',
        message: 'Ahh something went very wrong!',
    })
}
const globalError = (
    err: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 500

    if (process.env.NODE_ENV === 'development') {
        handleDevError(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        const error = { ...err, message: err.message }
        handleProdError(error, res)
    }
}

export default globalError
