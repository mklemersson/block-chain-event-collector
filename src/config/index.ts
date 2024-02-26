import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
	path: path.resolve(__dirname, '../../.env')
});

export default {
	DATABASE_URL: process.env.DATABASE_URL ?? '',
	DATABASE_USER: process.env.DATABASE_USER ?? '',
	DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? '',
	API_PORT: process.env.API_PORT ?? 3000
};
