import mongoose from 'mongoose';
import { ImportEventService } from '../../domain/contracts/import-event.service';
import {
	JobRepository,
	getEventRepository,
	getJobRepository
} from '../../domain/contracts/repositories';
import { JsonRpcProvider, ethers } from 'ethers';
import { FeeCollector } from '../../infrastructure/collectors/fee.collector';
import { CollectorsChainData } from '../../infrastructure/collectors/constants';

import abi from '../../infrastructure/collectors/definitions/polygonLifiAbi.json';
import config from '../../config';

const stopApp = (code?: number) => {
	console.log('Closing database connections');
	mongoose.connection.close();

	process.exit(code);
};

process.on('SIGINT', stopApp);
process.on('uncaughtException', () => {
	console.log('Unexpected error occurred, stopping the application.');

	stopApp();
});
process.on('unhandledRejection', (error) => {
	console.log('Unexpected rejection occurred, stopping the application.');
	console.error(error);

	stopApp();
});

async function startDatabase(): Promise<void> {
	try {
		await mongoose.connect(config.DATABASE_URL, {
			auth: {
				username: config.DATABASE_USER,
				password: config.DATABASE_PASSWORD
			},
			autoCreate: true
		});
	} catch (_) {
		console.error('Failed to connect to database, stopping service.');
		process.exit(1);
	}
}

async function getLastImportedBlock(
	jobRepository: JobRepository
): Promise<number> {
	return (
		(await jobRepository.findOne({ type: 'import' }).exec())?.lastBlock ??
		CollectorsChainData.polygon.LIFI_DEFAULT_START_BLOCK
	);
}

const DEFAULT_BATCH_SIZE = 3000 as const;

async function worker(): Promise<void> {
	await startDatabase();
	const provider = new JsonRpcProvider(
		CollectorsChainData.polygon.PROVIDER_URL
	);
	const currBlock = await provider.getBlockNumber();
	const jobRepository = getJobRepository();
	const collector = new FeeCollector(
		CollectorsChainData.polygon.CONTRACT_ADDRESS,
		abi,
		provider
	);

	const lastImportedBlock = await getLastImportedBlock(jobRepository);
	const importService = new ImportEventService(
		getEventRepository(),
		jobRepository,
		collector
	);
	await importService.run({
		batchSize: DEFAULT_BATCH_SIZE,
		startBlock: lastImportedBlock,
		endBlock: currBlock
	});
}

worker().then(() => console.log('Worker job done.'));
