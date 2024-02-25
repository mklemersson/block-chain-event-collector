import { JsonRpcProvider } from 'ethers';
import { CollectorsChainData } from '../../../src/infrastructure/collectors/constants';
import { FeeCollector } from '../../../src/infrastructure/collectors/fee.collector';

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

describe('# PolygonFeeCollector', () => {
	test('Load events from network', async () => {
		const collector = new FeeCollector(
			CollectorsChainData.polygon.CONTRACT_ADDRESS,
			lifiContractDefinition,
			new JsonRpcProvider(CollectorsChainData.polygon.PROVIDER_URL)
		);
		const oldestBlock = 47961368;

		const result = await collector.loadFeeEvents(
			oldestBlock,
			oldestBlock + 1000
		);

		expect(result.length).toBeGreaterThan(0);

		const parsedResult = await collector.parseEvents(result);

		expect(parsedResult[0]).toEqual(
			expect.objectContaining({
				token: expect.any(String),
				integrator: expect.any(String),
				integratorFee: expect.any(BigInt),
				lifiFee: expect.any(BigInt)
			})
		);
	});
});
