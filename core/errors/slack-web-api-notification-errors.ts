export class EarlyNotificationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "EarlyNotificationError";
	}
}
