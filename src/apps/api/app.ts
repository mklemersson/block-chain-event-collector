import { json as jsonBodyParser } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { eventsController } from './controllers/events.controller';

const app = express();

app.use(cors());
app.use(jsonBodyParser());

app.get('/api/integrator/:integrator/events', eventsController);

export default app;
