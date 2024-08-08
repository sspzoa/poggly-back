import express, {Express, NextFunction, Request, Response} from 'express'
import path from 'path'
import LoginRouter from './loginRouter'
import apiRouter from './apiRouter'
import swaggerUi from '../swagger/swagger'
const app:Express = express()


app.use(express.json())

app.set('port', 8080);

app.get('/', (req : Request, res : Response) => {
    const filePath = path.join(__dirname, "index.html")
    console.log(filePath)
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