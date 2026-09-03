import express, {NextFunction, Request, Response} from 'express';

import cors from 'cors';
import matchRouter from '../Match/match.route.js';
import playerRouter from '../Player/player.route.js';
import teamRouter from '../Team/team.route.js';
import userRouter from '../User/user.route.js';

import { signedRouter } from '../SignedPeople/signedpeople.route.js';
import { tournamentRouter } from '../Tournament/tournament.route.js';


export const app = express();


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // routes

app.use(teamRouter);
app.use(playerRouter);

// middlewares

app.use(express.json({limit: "10mb"}));
app.use(signedRouter);
app.use(userRouter);
app.use(tournamentRouter);
app.use(matchRouter);

app.use((err: Error, req:Request, res:Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

//fallback
app.use(async (req: Request, res:Response)=>{
    return res.status(404).json({error: "not found"});
});



