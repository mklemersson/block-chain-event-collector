import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
	path: path.resolve(__dirname, '../../.env')
});

export default {
	DATABASE_URL: process.env.DATABASE_URL ?? '',
	DATABASE_USER: process.env.DATABASE_USER ?? '',
	DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? ''
};
