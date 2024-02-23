import { InterfaceAbi } from 'ethers/abi';
import { Contract, EventLog } from 'ethers/contract';
import { BlockTag, ContractRunner, Log } from 'ethers/providers';
import { ParsedFeeCollectedEvents } from '../../domain/transaction/types';

export type ContractEventLog = EventLog | Log;

export interface IFeeCollector {
	loadFeeEvents(
		fromBlock: BlockTag,
		toBlock?: BlockTag
	): Promise<ContractEventLog[]>;
	parseEvents(events: ContractEventLog[]): ParsedFeeCollectedEvents[];
}

export class BaseFeeCollector implements IFeeCollector {
	protected collector: Contract;

	constructor(
		protected readonly address: string,
		protected readonly abi: InterfaceAbi,
		protected readonly provider: ContractRunner
	) {
		this.collector = new Contract(address, abi, provider);
	}

	parseEvents(events: ContractEventLog[]): ParsedFeeCollectedEvents[] {
		return events.map((event) => {
			const [token = '', integrator = '', integratorFee = -1, lifiFee = -1] =
				this.collector.interface.parseLog(event)?.args ?? [];

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
		toBlock?: BlockTag
	): Promise<ContractEventLog[]> {
		const filter = this.collector.filters.FeesCollected();
		return this.collector.queryFilter(filter, fromBlock, toBlock);
	}
}
