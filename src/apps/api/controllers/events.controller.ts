import { Request, Response } from 'express';
import { getEventRepository } from '../../../domain/contracts/repositories';
import { mapEventToJson } from '../../../domain/contracts/utils';
import { InvalidParameter } from '../errors';

function validateRequest(req: Request) {
	if (!req.params.integrator) {
		throw new InvalidParameter('integrator');
	}
}

export async function eventsController(req: Request, res: Response) {
	try {
		validateRequest(req);

		const integrator = req.params.integrator;
		const events = await getEventRepository()
			.find({ integrator })
			.sort({ blockNumber: 'desc' })
			.exec();

		res.status(200).send({
			data: events.map(mapEventToJson)
		});
	} catch (err) {
		console.error(err);
		switch (true) {
			case err instanceof InvalidParameter:
				res.status(400).send({ error: { message: err.message } });
				break;
			default:
				res
					.status(500)
					.send({ error: { message: 'Unexpected error occurred' } });
				break;
		}
	}
}
