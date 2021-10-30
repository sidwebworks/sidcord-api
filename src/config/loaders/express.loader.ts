import cors from 'cors'
import express, { Application } from 'express'
import helmet from 'helmet'

import { httpLogger } from '../logger'

const loader = (app: Application) => {
    /**
     *? Setup helmet security headers
     ** for more info: https://github.com/helmetjs/helmet
     */
    app.use(helmet())

    /**
     *? Enable trust proxy: eg. using NGINX
     */
    app.enable('trust proxy')

    /**
     *? Setup health check routes
     */
    app.get('/health', (_, res) => {
        res.status(200).end()
    })
    app.head('/health', (_, res) => {
        res.status(200).end()
    })

    /**
     *? Configure cross origin resource sharing
     */
    app.use(cors())

    app.use(httpLogger)

    app.use(express.json())

    app.use(express.urlencoded({ extended: false }))

    // Return the express app
    return app
}

export default loader
