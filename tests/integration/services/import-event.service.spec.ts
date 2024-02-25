import { JsonRpcProvider } from 'ethers';
import {
	type EventRepository,
	type JobRepository,
	getEventRepository,
	getJobRepository
} from '../../../src/domain/contracts/repositories';
import { ImportEventService } from '../../../src/domain/contracts/import-event.service';
import mongoose from 'mongoose';
import { FeeCollector } from '../../../src/infrastructure/collectors/fee.collector';
import { CollectorsChainData } from '../../../src/infrastructure/collectors/constants';

const lifiContractDefinition = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: '_token',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'address',
				name: '_integrator',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_integratorFee',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_lifiFee',
				type: 'uint256'
			}
		],
		name: 'FeesCollected',
		type: 'event'
	}
];

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_URL: string;
			DATABASE_USER: string;
			DATABASE_PASSWORD: string;
		}
	}
}

describe('# ImportEventService', () => {
	let eventRepository: EventRepository;
	let importJobRepository: JobRepository;

	beforeAll(async () => {
		await mongoose.connect(process.env.DATABASE_URL, {
			auth: {
				username: process.env.DATABASE_USER,
				password: process.env.DATABASE_PASSWORD
			},
			autoCreate: true
		});

		eventRepository = getEventRepository();
		importJobRepository = getJobRepository();
	});

	afterAll(async () => {
		await Promise.all([
			eventRepository.deleteMany().exec(),
			importJobRepository.deleteMany().exec()
		]);

		await mongoose.connection.close();
	});

	test('Should import FeeCollected events', async () => {
		const polygonFeeCollector = new FeeCollector(
			CollectorsChainData.polygon.CONTRACT_ADDRESS,
			lifiContractDefinition,
			new JsonRpcProvider(CollectorsChainData.polygon.PROVIDER_URL)
		);
		const startBlock = CollectorsChainData.polygon.LIFI_DEFAULT_START_BLOCK;
		const importService = new ImportEventService(
			eventRepository,
			importJobRepository,
			polygonFeeCollector
		);

		await importService.run({
			batchSize: 1000,
			startBlock,
			endBlock: startBlock + 10
		});

		const importedEvent = (await eventRepository.findOne().exec())?.toObject();

		expect(importedEvent).not.toBeFalsy();
		expect(importedEvent).toEqual(
			expect.objectContaining({
				blockNumber: expect.any(String),
				token: expect.any(String),
				integrator: expect.any(String),
				integratorFee: expect.any(Number),
				lifiFee: expect.any(Number)
			})
		);
	}, 15000);
});
