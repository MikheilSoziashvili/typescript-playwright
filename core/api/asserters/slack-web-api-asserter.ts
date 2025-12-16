import { SlackWebApiFacade } from "@core/facades/slack-web-api/slack-web-api-facade";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { LowHotWalletBalanceNotification } from "@enums/crypto/slack-notifications/low-hot-wallet-balance-notification";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { CryptoTicker } from "@enums/cryptocurrencies";
import { SlackMessageResponse } from "@dtos/responses/slack-web-api";
import { logger } from "@logger/logger";
import { waitForSeconds } from "@core/utils/utils";
import { EarlyNotificationError } from "@core/errors/slack-web-api-notification-errors";
import { NotificationTimeWindow } from "@core/types/types";

export class SlackWebApiAsserter {
	public constructor(private readonly slackWebApiFacade: SlackWebApiFacade) {}

	@step("Assert multiple low hot wallet balance notifications received")
	public async lowHotWalletBalanceNotificationsReceived(options: {
		expectedTickers: readonly CryptoTicker[];
		messagesCount?: number;
		timeoutSeconds?: number;
		pollIntervalSeconds?: number;
	}): Promise<void> {
		const {
			expectedTickers,
			messagesCount = 20,
			timeoutSeconds = TimeoutSeconds.SIXTY,
			pollIntervalSeconds = TimeoutSeconds.FIVE,
		} = options;

		// Add a buffer delay for force-flushed notifications
		await waitForSeconds(TimeoutSeconds.TEN);

		const timeWindow = this.calculateTimeWindow(timeoutSeconds);

		const { receivedAtLeastOne, remainingTickers } =
			await this.pollForNotifications(
				expectedTickers,
				timeWindow,
				messagesCount,
				pollIntervalSeconds,
			);

		if (!receivedAtLeastOne) {
			throw new Error(
				"No low hot wallet balance notifications were received, but at least one was expected.",
			);
		}

		if (remainingTickers.size > 0) {
			logger.warn(
				`No low balance notifications received for tickers (likely above threshold): ${[
					...remainingTickers,
				].join(", ")}`,
			);
		}
	}

	private calculateTimeWindow(
		timeoutSeconds: number,
	): NotificationTimeWindow {
		const nowMs = Date.now();
		const startTimestampSeconds = nowMs / 1000;

		// Notifications must NOT be earlier than this timestamp
		const earliestAllowedTimestampSeconds =
			startTimestampSeconds + timeoutSeconds;

		// Additional buffer delay — notification triggers are not guaranteed
		// to fire at the exact configured interval, so this ensures the system
		// has enough time to emit them.
		const endTimeMs =
			nowMs + (timeoutSeconds + TimeoutSeconds.SIXTY) * 1000;

		return {
			startTimestampSeconds,
			earliestAllowedTimestampSeconds,
			endTimeMs,
		};
	}

	@step("Poll for low hot wallet notifications in Slack")
	private async pollForNotifications(
		expectedTickers: readonly CryptoTicker[],
		timeWindow: NotificationTimeWindow,
		messagesCount: number,
		pollIntervalSeconds: number,
	): Promise<{
		receivedAtLeastOne: boolean;
		remainingTickers: Set<CryptoTicker>;
	}> {
		const client = this.slackWebApiFacade.getClient();
		const remainingTickers = new Set(expectedTickers);
		const processedMessages = new Set<string>();

		let receivedAtLeastOne = false;

		while (Date.now() < timeWindow.endTimeMs && remainingTickers.size > 0) {
			let notification: SlackMessageResponse | undefined;

			try {
				notification = await client.waitForMessage(
					(message) =>
						this.matchesNotification(
							message,
							timeWindow.startTimestampSeconds,
							timeWindow.earliestAllowedTimestampSeconds,
							remainingTickers,
							processedMessages,
						),
					messagesCount,
					pollIntervalSeconds,
					pollIntervalSeconds,
				);
			} catch (err) {
				// Early notifications are a hard failure — propagate immediately
				if (err instanceof EarlyNotificationError) {
					throw err;
				}

				// Otherwise continue polling until timeout
				continue;
			}

			receivedAtLeastOne = true;

			const detectedTicker = SlackWebApiAsserter.findTickerInText(
				notification.text,
			);

			processedMessages.add(notification.ts);
			remainingTickers.delete(detectedTicker);

			this.assertNotificationText(notification.text, detectedTicker);
		}

		return {
			receivedAtLeastOne: receivedAtLeastOne,
			remainingTickers: new Set(remainingTickers),
		};
	}

	private matchesNotification(
		message: SlackMessageResponse,
		startTimestampSeconds: number,
		earliestAllowedTimestampSeconds: number,
		remainingTickers: Set<CryptoTicker>,
		processedMessages: Set<string>,
	): boolean {
		const tsSeconds = Number(message.ts);

		// Fail fast if a low-balance notification arrives too early
		if (
			tsSeconds > startTimestampSeconds &&
			tsSeconds < earliestAllowedTimestampSeconds &&
			SlackWebApiAsserter.isLowHotWalletBalanceNotification(
				message,
				earliestAllowedTimestampSeconds,
			)
		) {
			throw new EarlyNotificationError(
				`Early low-balance notification received at ${tsSeconds}, before the valid window starting at ${earliestAllowedTimestampSeconds}.`,
			);
		}

		// Skip already processed Slack messages
		if (processedMessages.has(message.ts)) {
			return false;
		}

		// Filter out unrelated Slack messages
		if (
			!SlackWebApiAsserter.isLowHotWalletBalanceNotification(
				message,
				earliestAllowedTimestampSeconds,
			)
		) {
			return false;
		}

		// Ensure the notification contains a relevant crypto ticker
		const ticker = SlackWebApiAsserter.tryFindTickerInText(message.text);
		return ticker !== undefined && remainingTickers.has(ticker);
	}

	private static isLowHotWalletBalanceNotification(
		message: SlackMessageResponse,
		earliestAllowedTimestampSeconds: number,
	): boolean {
		const text = message.text.toLowerCase();
		const requiredKeywords = ["low wallet balance", "threshold"];

		return (
			Number(message.ts) >= earliestAllowedTimestampSeconds &&
			requiredKeywords.every((keyword) => text.includes(keyword))
		);
	}

	private static findTickerInText(notificationText: string): CryptoTicker {
		const ticker = this.tryFindTickerInText(notificationText);

		if (!ticker) {
			throw new Error(
				"Unable to detect crypto ticker in low hot wallet balance notification",
			);
		}

		return ticker;
	}

	private static tryFindTickerInText(
		notificationText: string,
	): CryptoTicker | undefined {
		const uppercasedText = notificationText.toUpperCase();

		// Sort by length to avoid partial matches
		const sortedTickers = Object.values(CryptoTicker).sort(
			(a, b) => b.length - a.length,
		);

		return sortedTickers.find((ticker) => uppercasedText.includes(ticker));
	}

	private assertNotificationText(
		notificationText: string,
		ticker: CryptoTicker,
	): void {
		const title = this.buildNotificationText(
			LowHotWalletBalanceNotification.TITLE,
			ticker,
		);

		const descriptionLow = this.buildNotificationText(
			LowHotWalletBalanceNotification.DESCRIPTION_LOW,
			ticker,
		);

		const descriptionEmpty = this.buildNotificationText(
			LowHotWalletBalanceNotification.DESCRIPTION_EMPTY,
			ticker,
		);

		expect(notificationText).toContain(title);

		const lowRegex = new RegExp(descriptionLow);
		const emptyRegex = new RegExp(descriptionEmpty);

		expect(
			notificationText.match(lowRegex) ||
				notificationText.match(emptyRegex),
		).not.toBeNull();
	}

	private buildNotificationText(
		text: string,
		cryptoTicker: CryptoTicker,
	): string {
		return text.replace("{cryptoTicker}", cryptoTicker);
	}
}
