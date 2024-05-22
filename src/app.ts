
// Author : Anshuman Tiwari ( lazycodebaker )

// Third-party imports
import express, { Express, Request, Response } from 'express'
import cookieParser from 'cookie-parser'

// Custom imports
import logger from './logger/Logging'
import { settings } from './config/settings'

const PORT = settings.server.PORT
// Create an express application
const app: Express = express()
// Configure express application
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World! , Please Go To /graphql')
})

 
logger.info('🚀 Express configured')

export default app
