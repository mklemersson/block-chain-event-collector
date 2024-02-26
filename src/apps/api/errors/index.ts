export class InvalidParameter extends Error {
	constructor(parameter: string) {
		super(`Invalid parameter providede for: ${parameter}`);
	}
}
