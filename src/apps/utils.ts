import mongoose from 'mongoose';

export const stopApp = () => {
	console.log('Stop signal received');

	console.log('Closing database connections');
	mongoose.connection.close();
};
