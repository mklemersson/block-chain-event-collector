import { IFeeCollector } from '../../infrastructure/collectors/fee.collector';
import logger from '../../infrastructure/logger';
import { delay } from '../../utils';
import { EventRepository, JobRepository } from './repositories';

interface JobRunOptions {
	batchSize?: number;
	startBlock: number;
	endBlock: number;
	jobDelaySeconds?: number;
}

export class ImportEventService {
	constructor(
		private readonly eventRepository: EventRepository,
		private readonly jobRepository: JobRepository,
		private readonly feeCollector: IFeeCollector
	) {}

	public async run(options: JobRunOptions): Promise<void> {
		const {
			batchSize = 500,
			startBlock = 0,
			endBlock = 0,
			jobDelaySeconds = 3
		} = options ?? {};
		let currentBlock = startBlock;
		logger.info(`Starting job with block: ${startBlock}`, options);

		while (currentBlock <= endBlock) {
			const feeEvents = await this.feeCollector.loadFeeEvents(
				currentBlock,
				currentBlock + batchSize
			);

			currentBlock += batchSize;

			if (!feeEvents.length) {
				logger.info(
					`No fee events found between blocks [${
						currentBlock - batchSize
					} - ${currentBlock}]`
				);
				await delay(jobDelaySeconds);
				continue;
			}

			const parsedEvents = await this.feeCollector.parseEvents(feeEvents);
			const lastEntry = parsedEvents[parsedEvents.length - 1];

			await this.eventRepository.insertMany(parsedEvents);

			if (lastEntry) {
				logger.info(`Last block saved: ${lastEntry.blockNumber}`);

				await this.jobRepository.updateOne(
					{ type: 'import' },
					{ lastBlock: lastEntry.blockNumber },
					{ upsert: true }
				);
			}

			await delay(jobDelaySeconds);
		}

		logger.info('Done syncing events');
	}
}
