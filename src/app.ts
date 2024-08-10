import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import ToDoList from './mongo/Todo_list'
const app = express();

dotenv.config()

mongoose
    .connect(
        process.env.DATABASE_URL as string
    ).then(()=> {
        console.log("Connected to Database")
    }).catch(()=> {
        console.log("Connection fail")
    })


app.use(cors())
app.use(express.json());


app.get('/welcome', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    data: {
      message: 'Welcome to the Poggly!',
    },
  });
});

app.get('/env', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    data: {
      message: process.env.SECRET_KEY,
    },
  });
});

app.post('/addToDo', async (req: Request, res: Response) => {
  const {name, time} = req.body
  console.log(name, time);
  try {

    const newToDo = await new ToDoList({
      name,
      time
    })

    const savedToDo = await newToDo.save()
    console.log("Saved : ", savedToDo)

    return res.json({
      data : {
        result : "success"
      }
    })
  } catch (error) {
    return res.json({
      data : {
        result : "error"
      }
    })
  }
})

app.listen('8080', () => {
  console.log(`
  ################################################
  🛡  Server listening on port: 8080  🛡
  ################################################
`);
});