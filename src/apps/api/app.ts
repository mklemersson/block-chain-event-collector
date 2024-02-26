import express from 'express';
import cors from 'cors';
import { json as jsonBodyParser } from 'body-parser';
import { eventsController } from './controllers/events.controller';

const app = express();

app.use(cors());
app.use(jsonBodyParser());

app.get('/api/integrator/:integrator/events', eventsController);

export default app;
