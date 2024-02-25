export interface ParsedFeeCollectedEvents {
	timestamp: number;
	blockNumber: number;
	blockHash: string;
	transactionHash: string;
	token: string;
	integrator: string;
	integratorFee: BigInt;
	lifiFee: BigInt;
}
