import { PolygonFeeCollector } from '../../../src/infrastructure/collectors/polygon/polygon-fee.collector';

describe('# PolygonFeeCollector', () => {
	test('Load events from network', async () => {
		const collector = new PolygonFeeCollector();
		const oldestBlock = 47961368;

		const result = await collector.loadFeeEvents(
			oldestBlock,
			oldestBlock + 1000
		);

		expect(result.length).toBeGreaterThan(0);

		const parsedResult = collector.parseEvents(result);

		expect(parsedResult[0]).toEqual({
			token: expect.any(String),
			integrator: expect.any(String),
			integratorFee: expect.any(BigInt),
			lifiFee: expect.any(BigInt)
		});
	});
});
