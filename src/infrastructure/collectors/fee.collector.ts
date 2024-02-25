import { ethers } from 'ethers';
import { InterfaceAbi } from 'ethers/abi';
import { Contract, EventLog } from 'ethers/contract';
import { BlockTag, ContractRunner, Log } from 'ethers/providers';
import { ParsedFeeCollectedEvents } from '../../domain/contracts/types';

type ContractEventLog = EventLog | Log;

export interface IFeeCollector {
	loadFeeEvents(
		fromBlock: BlockTag,
		toBlock?: BlockTag
	): Promise<ContractEventLog[]>;
	parseEvents(events: ContractEventLog[]): Promise<ParsedFeeCollectedEvents[]>;
}

export class FeeCollector implements IFeeCollector {
	protected collector: Contract;

	constructor(
		protected readonly address: string,
		protected readonly abi: InterfaceAbi,
		protected readonly provider: ContractRunner
	) {
		this.collector = new Contract(address, abi, provider);
	}

	async parseEvents(
		events: ContractEventLog[]
	): Promise<ParsedFeeCollectedEvents[]> {
		const parsedEvents: ParsedFeeCollectedEvents[] = [];

		for (const event of events) {
			const parsedLog = this.collector.interface.parseLog(event);
			const [
				token = undefined,
				integrator,
				integratorFee,
				lifiFee = undefined
			] = parsedLog?.args ?? [];

			if (token === undefined || lifiFee === undefined) {
				continue;
			}

			const feesCollected: ParsedFeeCollectedEvents = {
				timestamp: (await event.getBlock()).timestamp,
				blockNumber: event.blockNumber,
				blockHash: event.blockHash,
				transactionHash: event.transactionHash,
				token,
				integrator,
				integratorFee: BigInt(integratorFee),
				lifiFee: BigInt(lifiFee)
			};
			parsedEvents.push(feesCollected);
		}

		return parsedEvents;
	}

	loadFeeEvents(
		fromBlock: BlockTag,
		toBlock?: BlockTag
	): Promise<ContractEventLog[]> {
		const filter = this.collector.filters.FeesCollected();
		return this.collector.queryFilter(filter, fromBlock, toBlock);
	}

	async getCurrentBlock(): Promise<number> {
		return await ethers.getDefaultProvider(this.address).getBlockNumber();
	}
}
