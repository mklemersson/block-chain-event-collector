import { Severity, modelOptions, pre, prop } from '@typegoose/typegoose';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Job {
	@prop()
	public lastBlock?: number;

	@prop()
	public type?: 'import' | 'export';

	@prop({ index: true })
	public updatedAt?: Date;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Event {
	@prop()
	public timestamp?: number;

	@prop({ alias: 'block', index: true })
	public blockNumber?: string;

	@prop()
	public token?: string;

	@prop({ index: true })
	public integrator?: string;

	@prop()
	public integratorFee?: BigInt;

	@prop()
	public lifiFee?: BigInt;
}
