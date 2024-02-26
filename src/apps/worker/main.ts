import { JsonRpcProvider } from 'ethers';
import { ImportEventService } from '../../domain/contracts/import-event.service';
import {
	JobRepository,
	getEventRepository,
	getJobRepository
} from '../../domain/contracts/repositories';
import { CollectorsChainData } from '../../infrastructure/collectors/constants';
import { FeeCollector } from '../../infrastructure/collectors/fee.collector';

import abi from '../../infrastructure/collectors/definitions/polygonLifiAbi.json';
import { getDatabaseConnection } from '../../infrastructure/database';
import logger from '../../infrastructure/logger';
import { setUpErrorHandlers } from '../utils';

const DEFAULT_BATCH_SIZE = 3000 as const;
async function getLastImportedBlock(
	jobRepository: JobRepository
): Promise<number> {
	return (
		(await jobRepository.findOne({ type: 'import' }).exec())?.lastBlock ??
		CollectorsChainData.polygon.LIFI_DEFAULT_START_BLOCK
	);
}

setUpErrorHandlers();

async function worker(): Promise<void> {
	const connection = await getDatabaseConnection();
	connection.once('open', () => logger.info('Database connected'));
	connection.on('error', (err) =>
		logger.error(`Database connection error: ${err.message}`)
	);

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

worker().then(() => logger.info('Worker job done.'));
