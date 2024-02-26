import { DocumentType } from '@typegoose/typegoose';
import { Event } from './entities';

export const mapEventToJson = (event: DocumentType<Event>) => {
	const eventObj = event.toObject();

	return {
		...eventObj,
		integratorFee: eventObj.integratorFee?.toString() ?? '',
		lifiFee: eventObj.lifiFee?.toString() ?? ''
	};
};
