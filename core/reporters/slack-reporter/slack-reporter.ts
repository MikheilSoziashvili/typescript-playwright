import { ReporterDescription } from "@playwright/test";
import { Block, KnownBlock } from "@slack/types";
import { SummaryResults } from "playwright-slack-report/dist/src";
import archiver from "archiver";
import { promises as fs } from "fs";

import { WebClient } from "@slack/web-api";
import { join } from "path";
import { FileUploadResult } from "./slack-reporter-interfaces";

let slackClient: WebClient;

const SlackReporterEmoji = {
	passed: ":white_check_mark:",
	failed: ":x:",
	timedOut: ":timeout-clock:",
	interrupted: ":fast_forward:",
	skipped: ":fast_forward:",
	playwright: ":performing_arts:",
	flaky: ":warning:",
};
const REPORT_ZIP_FILE_NAME = "playwright-report.zip";
const REPORT_HTML_DIR_NAME = "playwright-report";

function initSlackWebApi(slackConfig: Record<string, string>): WebClient {
	return new WebClient(slackConfig.oAuthToken);
}

export function slackReporterConfig(
	slackConfig: Record<string, string>,
	metaData: { key: string; value: string }[],
): ReporterDescription {
	slackClient = initSlackWebApi(slackConfig);
	return [
		"./node_modules/playwright-slack-report/dist/src/SlackReporter.js",
		{
			channels: ["e2e-tests-reporting"],
			// slackWebHookUrl: slackConfig.webHookUrl,
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

	const meta: { type: string; text: { type: string; text: string } }[] = [];

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

	await zipReport();

	const htmlReport = await uploadFile(
		join(process.cwd(), REPORT_ZIP_FILE_NAME),
	);

	meta.push({
		type: "section",
		text: {
			type: "mrkdwn",
			text: `\n*HTML Results*: \t<${htmlReport?.files[0]?.files[0]?.permalink}|📊>`,
		},
	});

	return [
		header,
		summary,
		{ type: "divider" },
		...testDetails,
		{ type: "divider" },
		...meta,
	];
}

async function uploadFile(
	filePath: string,
): Promise<FileUploadResult | undefined> {
	try {
		const result = await slackClient.files.uploadV2({
			channel_id: "C072SMUNXNH", // channel id not channel name
			file: await fs.readFile(filePath),
			filename: filePath.split("/").at(-1),
		});

		console.log(JSON.stringify(result));
		console.log("result", result);

		return result as unknown as FileUploadResult;
	} catch (error) {
		console.log("error", error);
	}
}

async function zipReport(): Promise<void> {
	const sourceDir = join(process.cwd(), REPORT_HTML_DIR_NAME);
	const zipFilePath = join(process.cwd(), REPORT_ZIP_FILE_NAME);
	const archive = archiver("zip", { zlib: { level: 9 } });
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
