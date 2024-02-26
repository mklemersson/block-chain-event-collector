import mongoose from 'mongoose';
import config from '../../config';
import logger from '../logger';

export async function getDatabaseConnection(): Promise<mongoose.Connection> {
	try {
		const db = await mongoose.connect(config.DATABASE_URL, {
			auth: {
				username: config.DATABASE_USER,
				password: config.DATABASE_PASSWORD
			},
			autoCreate: true
		});

		return db.connection;
	} catch (err) {
		const error = err as Error;
		logger.error(`Failed to stablish database connection: ${error.message}`);

		process.exit(1);
	}
}
