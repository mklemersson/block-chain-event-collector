import config from '../../config';
import logger from '../../infrastructure/logger';
import { getDatabaseConnection } from '../../infrastructure/database';
import { setUpErrorHandlers } from '../utils';
import app from './app';

setUpErrorHandlers();

getDatabaseConnection()
	.then((connection) => {
		connection.once('open', () => logger.info('Database connected'));
		connection.once('error', (err) => {
			logger.error(`Error on database connection: ${err.message}`);
			logger.error(err);
		});
	})
	.catch((err) => {
		logger.error('Failed to retrieve database connection');
		logger.error(err);
		process.exit(1);
	});

app.listen(config.API_PORT, () =>
	logger.info(`API is running at port: ${config.API_PORT}`)
);
