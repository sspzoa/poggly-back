import express, {Express, NextFunction, Request, Response} from 'express'
import path from 'path'
import LoginRouter from './loginRouter'
import apiRouter from './apiRouter'
import swaggerUi from '../swagger/swagger'
import cors from 'cors'
const app:Express = express()

app.use(cors())
app.use(express.json())

app.set('port', 8080);

app.get('/', (req : Request, res : Response) => {
    const filePath = path.join(__dirname, "index.html")
    res.sendFile(filePath)

})
app.use("/login", LoginRouter)
app.use('/api', apiRouter)
app.use('/api-docs', swaggerUi.swaggerUi.serve, swaggerUi.swaggerUi.setup(swaggerUi.specs))

app.get('/welcome', (req: Request, res: Response, next:NextFunction): void => {
    res.json({
        data: {
            message: 'Welcome to the Poggly'
        }
    })
})

app.listen(app.get("port"),() => {
    console.log(`Server is running on http://127.0.0.1:${app.get('port')}`)
})