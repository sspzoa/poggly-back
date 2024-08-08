import express, { type Request, type Response, type NextFunction } from 'express';

const app = express();

app.use(express.json());

app.get('/welcome', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    data: {
      message: 'Welcome to the Poggly!',
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
