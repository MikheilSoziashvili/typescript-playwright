import { ReporterDescription } from "@playwright/test";
import { Block, KnownBlock } from "@slack/types";
import { SummaryResults } from "playwright-slack-report/dist/src";
import archiver from "archiver";
import { promises as fs } from "fs";

import { WebClient } from "@slack/web-api";
import { join } from "path";
import { FileUploadResult } from "./slack-reporter-interfaces";
import {
	ARCHIVER_ZLIB_LEVEL,
	REPORT_HTML_DIR_NAME,
	REPORT_SLACK_CHANNEL_ID,
	REPORT_ZIP_FILE_NAME,
	SlackReporterEmoji,
} from "./slack-reporter-constants";
import { logger } from "@logger/logger";
import * as Configuration from "configuration";

let slackClient: WebClient;

function initSlackWebApi(
	slackConfig: Record<string, string | string[]>,
): WebClient {
	return new WebClient(slackConfig.oAuthToken as string);
}

export function slackReporterConfig(
	slackConfig: Record<string, string | string[]>,
	metaData?: { key: string; value: string }[],
): ReporterDescription {
	slackClient = initSlackWebApi(slackConfig);
	return [
		"./node_modules/playwright-slack-report/dist/src/SlackReporter.js",
		{
			channels: slackConfig.channels,
			slackOAuthToken: slackConfig.oAuthToken,
			sendResults: "always",
			disableUnfurl: true,
			layoutAsync: generateCustomLayout,
			meta: metaData,
		},
	];
}

export async function generateCustomLayout(
	summaryResults: SummaryResults,
): Promise<(Block | KnownBlock)[]> {
	let { tests } = summaryResults;

	tests = tests.filter(
		(value, index, self) =>
			index ===
			self.findIndex(
				(t) =>
					t.suiteName === value.suiteName &&
					t.name === value.name &&
					t.retry === value.retry &&
					t.startedAt === value.startedAt &&
					t.endedAt === value.endedAt,
			),
	);

	const header = {
		type: "header",
		text: {
			type: "plain_text",
			text: `${SlackReporterEmoji.playwright} Playwright E2E Test Results`,
			emoji: true,
		},
	};

	const summary = {
		type: "section",
		text: {
			type: "mrkdwn",
			text: `${SlackReporterEmoji.passed} *${summaryResults.passed}* | ${SlackReporterEmoji.failed} *${summaryResults.failed}* | ${SlackReporterEmoji.flaky} *${summaryResults.flaky}* | ${SlackReporterEmoji.skipped} *${summaryResults.skipped}*`,
		},
	};

	const testDetails: (Block | KnownBlock)[] = [];

	for (const t of tests) {
		let testDetailsRow = `${SlackReporterEmoji[t.status]} *[${
			t.projectName
		}] | ${t.suiteName.replace(/\W/gi, "-")} > ${t.name}*`;

		testDetailsRow += t.retry > 0 ? ` (retry #${t.retry})` : "";

		testDetails.push({
			type: "section",
			text: {
				type: "mrkdwn",
				text: testDetailsRow,
			},
		});
	}

	const meta: (Block | KnownBlock)[] = [];

	if (summaryResults.meta) {
		for (const metaRecord of summaryResults.meta) {
			const { key, value } = metaRecord;
			meta.push({
				type: "section",
				text: {
					type: "mrkdwn",
					text: `\n*${key}* :\t${value}`,
				},
			});
		}
	}

	const environmentUrlSection = {
		type: "section",
		text: {
			type: "mrkdwn",
			text: `*ENVIRONMENT_URL* : <${Configuration.environment_url}>`,
		},
	};

	await zipReport();

	const htmlReport = await uploadFile(
		join(process.cwd(), REPORT_ZIP_FILE_NAME),
	);

	const htmlResultsMessage = {
		type: "section",
		text: {
			type: "mrkdwn",
			text: `\n*HTML Results*: <${htmlReport?.files[0]?.files[0]?.permalink}|📊>`,
		},
	};

	const divider = { type: "divider" };
	const noTestMessage = {
		type: "section",
		text: {
			type: "mrkdwn",
			text: "*No tests were executed!*",
		},
	};
	const testDetailsOmittedMessage = {
		type: "section",
		text: {
			type: "mrkdwn",
			text: "Test details are not displayed due to message size limitations.\nPlease, refer to the attached report for full details.",
		},
	};

	// Slack block limitation (50 blocks per message)
	const baseBlocks = [header, summary, divider, ...meta];
	const maxBlocks = 50;
	const totalBlockCount = baseBlocks.length + testDetails.length;

	if (totalBlockCount > maxBlocks) {
		// If total blocks exceed 50, exclude testDetails
		return [
			...baseBlocks,
			testDetailsOmittedMessage,
			environmentUrlSection,
			htmlResultsMessage,
		];
	} else {
		// Include testDetails if within block limit
		return [
			...baseBlocks,
			...(testDetails.length === 0 ? [noTestMessage] : testDetails),
			divider,
			environmentUrlSection,
			htmlResultsMessage,
		];
	}
}

async function uploadFile(
	filePath: string,
): Promise<FileUploadResult | undefined> {
	try {
		const result = await slackClient.files.uploadV2({
			channel_id: REPORT_SLACK_CHANNEL_ID, // channel id not channel name
			file: await fs.readFile(filePath),
			filename: filePath.split("/").at(-1),
		});

		return result as unknown as FileUploadResult;
	} catch (error) {
		logger.error(error);
	}
}

async function zipReport(): Promise<void> {
	const sourceDir = join(process.cwd(), REPORT_HTML_DIR_NAME);
	const zipFilePath = join(process.cwd(), REPORT_ZIP_FILE_NAME);
	const archive = archiver("zip", { zlib: { level: ARCHIVER_ZLIB_LEVEL } });
	const zipFile = await fs.open(zipFilePath, "w");
	const stream = zipFile.createWriteStream();

	return new Promise((resolve, reject) => {
		archive
			.directory(sourceDir, false)
			.on("error", (err) => reject(err))
			.pipe(stream);

		stream.on("close", () => resolve());
		void archive.finalize();
	});
}
