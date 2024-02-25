import { ReturnModelType, getModelForClass } from '@typegoose/typegoose';
import { Event, Job } from './entities';

export const getEventRepository = () => getModelForClass(Event);
export const getJobRepository = () => getModelForClass(Job);

export type EventRepository = ReturnModelType<typeof Event>;
export type JobRepository = ReturnModelType<typeof Job>;
