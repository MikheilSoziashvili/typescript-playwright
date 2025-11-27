import { WebClient, ConversationsListResponse } from "@slack/web-api";
import {
	SlackMessageResponse,
	SlackHistoryResponse,
	SlackChannelInfoResponse,
} from "@dtos/responses/slack-web-api";

import { waitUntil } from "@core/utils/utils";
import { TimeoutSeconds } from "@enums/timeout-seconds";

import {
	SlackAuthError,
	SlackChannelError,
	SlackApiError,
	SlackError,
} from "@core/errors/slack-web-api-errors";

type ConversationsListChannel = NonNullable<
	ConversationsListResponse["channels"]
>[number];

export class SlackWebApi {
	private client: WebClient;
	private channelId?: string;

	/**
	 * Creates a Slack Web API client instance.
	 *
	 * @param token - The Slack bot OAuth token (xoxb-...)
	 * @param channelId - Optional channel ID to bind the client to
	 *
	 * @throws SlackAuthError If the provided token is missing or empty.
	 */
	constructor(token: string, channelId?: string) {
		this.checkTokenProvided(token);
		this.client = new WebClient(token);
		this.channelId = channelId;
	}

	/**
	 * Validates that a Slack OAuth token was provided.
	 *
	 * @param token - OAuth token to validate
	 *
	 * @throws SlackAuthError If the token is missing or empty.
	 * @private
	 */
	private checkTokenProvided(token: string): void {
		if (!token) {
			throw new SlackAuthError("Slack bot token is missing.");
		}
	}

	/**
	 * Resolves the channel to be used by an operation.
	 * Prefers a provided channel ID but falls back to a bound channel.
	 *
	 * Ensures that a channel exists before any Slack API call proceeds.
	 *
	 * @param channelId - Explicit channel ID (optional)
	 *
	 * @returns A valid Slack channel ID
	 *
	 * @throws SlackChannelError If no channel is provided and none is bound.
	 * @private
	 */
	private getBoundOrProvidedChannel(channelId?: string): string {
		const channel = channelId ?? this.channelId;
		if (!channel) {
			throw new SlackChannelError(
				"Channel must be provided or client must be channel-bound.",
			);
		}
		return channel;
	}

	/**
	 * Checks that a Slack API response returned `ok: true`.
	 *
	 * @param result - Slack API result object containing at least `ok`
	 *
	 * @throws SlackApiError If the Slack API returned a failure (ok: false)
	 * @private
	 */
	private checkSlackOk(result: { ok: boolean }): void {
		if (!result.ok) {
			throw new SlackApiError("Slack API responded with an error.");
		}
	}

	/**
	 * Ensures a Slack ConversationsListChannel has non-null
	 * `id` and `name` fields so it can be safely used in mappings.
	 *
	 * @param c - Raw Slack channel object
	 *
	 * @returns True if channel has valid `id` and `name`
	 * @private
	 */
	private isValidSlackChannel(
		this: void,
		c: ConversationsListChannel,
	): c is ConversationsListChannel &
		Required<Pick<ConversationsListChannel, "id" | "name">> {
		return typeof c.id === "string" && typeof c.name === "string";
	}

	/**
	 * Returns the currently bound Slack channel ID, if any.
	 */
	public get boundChannel(): string | undefined {
		return this.channelId;
	}

	/**
	 * Binds the Slack client to a specific channel for future operations.
	 *
	 * @param channelId - Slack channel ID to bind
	 */
	public setChannel(channelId: string): void {
		this.channelId = channelId;
	}

	/**
	 * Ensures that the bot is a member of the given channel.
	 *
	 * Uses `conversations.info` to verify `is_member === true`.
	 *
	 * @param channelId - Optional channel ID (defaults to bound channel)
	 *
	 * @throws SlackChannelError If the bot is not a member of the channel.
	 * @throws SlackApiError If Slack returns an error.
	 */
	public async ensureBotInChannel(channelId?: string): Promise<void> {
		const channel = this.getBoundOrProvidedChannel(channelId);

		const response = await this.client.conversations.info({ channel });
		this.checkSlackOk(response);

		if (!response.channel || response.channel.is_member !== true) {
			throw new SlackChannelError(
				`Bot is not a member of channel '${channel}'. Invite the bot with '/invite @botname'.`,
			);
		}
	}

	/**
	 * Lists all channels visible to the Slack bot.
	 *
	 * @returns A list of channel metadata that the bot can see.
	 *
	 * @throws SlackApiError If the Slack API returns an error response.
	 */
	public async listChannels(): Promise<SlackChannelInfoResponse[]> {
		const result = await this.client.conversations.list();
		this.checkSlackOk(result);

		return (result.channels ?? [])
			.filter(this.isValidSlackChannel)
			.map((c) => ({
				id: c.id,
				name: c.name,
				is_private: c.is_private,
			}));
	}

	/**
	 * Resolves a Slack channel ID from its name (without the leading `#`).
	 *
	 * @param name - The channel name (e.g., "alerts")
	 *
	 * @returns The channel ID if found, otherwise `null`.
	 */
	public async getChannelIdByName(name: string): Promise<string | null> {
		const channels = await this.listChannels();
		return channels.find((c) => c.name === name)?.id ?? null;
	}

	/**
	 * Retrieves recent messages from a Slack channel.
	 *
	 * @param limit - Maximum number of messages to fetch (default: 20)
	 * @param channelId - Optional explicit channel ID (defaults to bound channel)
	 *
	 * @returns An array of Slack messages.
	 *
	 * @throws SlackChannelError If no channel is provided or bound.
	 * @throws SlackApiError If Slack API returns an error.
	 */
	public async readMessages(
		limit = 20,
		channelId?: string,
	): Promise<SlackMessageResponse[]> {
		const channel = this.getBoundOrProvidedChannel(channelId);

		const result = (await this.client.conversations.history({
			channel,
			limit,
		})) as SlackHistoryResponse;

		this.checkSlackOk(result);
		return result.messages;
	}

	/**
	 * Reads a Slack thread (replies to a parent message).
	 *
	 * @param threadTs - Timestamp of the parent thread message
	 * @param channelId - Optional explicit channel ID (defaults to bound channel)
	 *
	 * @returns An array of Slack messages within the thread.
	 *
	 * @throws SlackChannelError If no channel is provided or bound.
	 * @throws SlackApiError If Slack API returns an error.
	 */
	public async readThread(
		threadTs: string,
		channelId?: string,
	): Promise<SlackMessageResponse[]> {
		const channel = this.getBoundOrProvidedChannel(channelId);

		const result = (await this.client.conversations.replies({
			channel: channel,
			ts: threadTs,
		})) as SlackHistoryResponse;

		this.checkSlackOk(result);
		return result.messages;
	}

	/**
	 * Sends a message to a Slack channel.
	 *
	 * @param text - The message content
	 * @param channelId - Optional explicit channel ID (defaults to bound channel)
	 *
	 * @throws SlackChannelError If no channel is provided or bound.
	 * @throws SlackApiError If Slack API returns an error.
	 */
	public async sendMessage(text: string, channelId?: string): Promise<void> {
		const channel = this.getBoundOrProvidedChannel(channelId);

		const result = await this.client.chat.postMessage({ channel, text });
		this.checkSlackOk(result);
	}

	/**
	 * Finds the first Slack message matching a predicate.
	 *
	 * @param match - Function that tests a message
	 * @param limit - Number of messages to search (default: 50)
	 *
	 * @returns The first matching message, or undefined if none match.
	 *
	 * @throws SlackApiError If Slack API returns an error.
	 */
	public async findMessage(
		match: (msg: SlackMessageResponse) => boolean,
		limit = 50,
	): Promise<SlackMessageResponse | undefined> {
		const messages = await this.readMessages(limit);
		return messages.find(match);
	}

	/**
	 * Waits for the appearance of a message matching the provided predicate.
	 *
	 * Polls Slack at regular intervals until:
	 *  - a message is found, OR
	 *  - a timeout occurs
	 *
	 * @param match - Predicate used to match a message
	 * @param timeoutSeconds - Maximum time to wait (default: 30 seconds)
	 * @param pollIntervalSeconds - Polling interval (default: 2 seconds)
	 *
	 * @returns The matching Slack message.
	 *
	 * @throws SlackChannelError If channel is not provided or bound.
	 * @throws SlackApiError If Slack API returns an error.
	 * @throws SlackError If waitUntil resolves but no message was captured.
	 */
	public async waitForMessage(
		match: (msg: SlackMessageResponse) => boolean,
		messagesCount = 50,
		timeoutSeconds = TimeoutSeconds.THIRTY,
		pollIntervalSeconds = TimeoutSeconds.TWO,
	): Promise<SlackMessageResponse> {
		let foundMessage: SlackMessageResponse | undefined;

		await waitUntil(
			async () => {
				const messages = await this.readMessages(messagesCount);
				foundMessage = messages.find(match);
				return foundMessage !== undefined;
			},
			{
				errorMessage: "Timeout waiting for Slack message.",
				intervalSeconds: pollIntervalSeconds,
				timeoutSeconds: timeoutSeconds,
			},
		);

		if (!foundMessage) {
			throw new SlackError(
				"SlackWebApi.waitForMessage: waitUntil resolved but message was undefined.",
			);
		}

		return foundMessage;
	}
}
