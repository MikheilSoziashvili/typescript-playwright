import { SlackWebApi } from "./slack-web-api";

export class SlackWebApiFactory {
	constructor(private readonly token: string) {
		if (!token) {
			throw new Error("Slack bot token is required for factory.");
		}
	}

	/**
	 * Creates a SlackWebApi client without a bound channel.
	 *
	 * Useful for operations such as:
	 *  - listing channels,
	 *  - resolving channel IDs,
	 *  - performing dynamic channel logic.
	 *
	 * @returns A SlackWebApi instance with no pre-bound channel.
	 */
	public create(): SlackWebApi {
		return new SlackWebApi(this.token);
	}

	/**
	 * Creates a SlackWebApi client bound to the channel identified by name.
	 *
	 * This method:
	 *  1. Instantiates a temporary SlackWebApi client.
	 *  2. Resolves the channel ID from the given name.
	 *  3. Returns a new SlackWebApi client bound to that channel.
	 *
	 * @param channelName - Name of the Slack channel (e.g., "crypto-low-wallet-balance-e2e").
	 *
	 * @returns A SlackWebApi instance bound to the resolved channel ID.
	 *
	 * @throws Error If the channel cannot be found.
	 */
	public async forChannel(channelName: string): Promise<SlackWebApi> {
		const api = new SlackWebApi(this.token);

		const id = await api.getChannelIdByName(channelName);

		if (!id) {
			throw new Error(`Channel '${channelName}' not found.`);
		}

		return new SlackWebApi(this.token, id);
	}
}
