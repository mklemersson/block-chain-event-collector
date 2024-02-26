import mongoose from 'mongoose';

const stopApp = async () => {
	console.log('Closing database connections');

	try {
		await mongoose.connection.close();
	} catch (_) {
		console.log('Failed to close database connection');
	} finally {
		process.exit(1);
	}
};

export const setUpErrorHandlers = () => {
	process.on('SIGINT', async () => {
		console.log('Application has been killed.');

		await stopApp();
	});
	process.on('uncaughtException', async () => {
		console.log('Unexpected error occurred, stopping the application.');

		await stopApp();
	});
	process.on('unhandledRejection', async (error) => {
		console.log('Unexpected rejection occurred, stopping the application.');
		console.error(error);

		await stopApp();
	});
};
