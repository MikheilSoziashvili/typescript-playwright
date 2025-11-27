export class SlackError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SlackError";
	}
}

export class SlackAuthError extends SlackError {
	constructor(message = "Slack authentication failed.") {
		super(message);
		this.name = "SlackAuthError";
	}
}

export class SlackChannelError extends SlackError {
	constructor(message = "Slack channel error.") {
		super(message);
		this.name = "SlackChannelError";
	}
}

export class SlackApiError extends SlackError {
	constructor(message = "Slack API responded with an error.") {
		super(message);
		this.name = "SlackApiError";
	}
}

export class SlackPreconditionError extends SlackError {
	constructor(message = "Slack precondition failed.") {
		super(message);
		this.name = "SlackPreconditionError";
	}
}
