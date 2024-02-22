import { InterfaceAbi } from 'ethers/abi';
import { Contract, ContractInterface, EventLog } from 'ethers/contract';
import { BlockTag, ContractRunner, Log } from 'ethers/providers';
import { ParsedFeeCollectedEvents } from 'src/domain/transaction/types';

export interface IFeeCollector {
	loadFeeEvents(
		fromBlock: BlockTag,
		toBlock: BlockTag
	): Promise<(EventLog | Log)[]>;
	parseEvents(events: (EventLog | Log)[]): ParsedFeeCollectedEvents[];
}

export abstract class BaseFeeCollector implements IFeeCollector {
	protected collector: Contract;

	constructor(
		protected readonly address: string,
		protected readonly abi: InterfaceAbi,
		protected readonly provider: ContractRunner
	) {
		this.collector = new Contract(address, abi, provider);
	}

	parseEvents(events: (EventLog | Log)[]): ParsedFeeCollectedEvents[] {
		return events.map((event) => {
			const [
				token = '',
				integrator = '',
				integratorFee = '-1',
				lifiFee = '-1'
			] = this.collector.interface.parseLog(event)?.args ?? [];

			const feesCollected: ParsedFeeCollectedEvents = {
				token,
				integrator,
				integratorFee: BigInt(integratorFee),
				lifiFee: BigInt(lifiFee)
			};
			return feesCollected;
		});
	}

	loadFeeEvents(
		fromBlock: BlockTag,
		toBlock: BlockTag
	): Promise<(EventLog | Log)[]> {
		const filter = this.collector.filters.FeesCollected();
		return this.collector.queryFilter(filter, fromBlock, toBlock);
	}
}
