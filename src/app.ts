import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors'
const app = express();

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

app.listen('8080', () => {
  console.log(`
  ################################################
  🛡  Server listening on port: 8080  🛡
  ################################################
`);
});