import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

import shortenRouter from './routes/shorten.js'
import viewLinkRouter from './routes/view-link.js'

const app = express()
console.clear() //temporary


//Middlewares
app.use(rateLimit({
    //should be handled in a NGINX or Apache server but for development purposes use express-rate-limit
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
}))

app.use(helmet())
app.use(express.json({limit: '5kb'}))
app.use(cookieParser())
app.use(cors())



//endpoints
app.get('/', (req,res) => {
    res.send("Main")
})
app.use('/api', shortenRouter)
app.use('/', viewLinkRouter)




//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});






app.listen(8000, () => console.log("on"))