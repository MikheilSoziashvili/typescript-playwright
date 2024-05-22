import { ReporterDescription } from "@playwright/test";
import { Block, KnownBlock } from "@slack/types";
import { SummaryResults } from "playwright-slack-report/dist/src";
// import fs from "fs";

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

		// if (t.attachments) {
		// 	for (const a of t.attachments) {
		// 		const file = await uploadFile(a.path);

		// 		if (file) {
		// 			if (a.name === "screenshot" && file.permalink) {
		// 				testDetails.push({
		// 					alt_text: "",
		// 					image_url: file.permalink,
		// 					title: {
		// 						type: "plain_text",
		// 						text: file.name || "",
		// 					},
		// 					type: "image",
		// 				});
		// 			}

		// 			if (a.name === "video" && file.permalink) {
		// 				testDetails.push({
		// 					alt_text: "",
		// 					// NOTE:
		// 					// Slack requires thumbnail_url length to be more that 0
		// 					// Either set screenshot url as the thumbnail or add a placeholder image url
		// 					thumbnail_url: "",
		// 					title: {
		// 						type: "plain_text",
		// 						text: file.name || "",
		// 					},
		// 					type: "video",
		// 					video_url: file.permalink,
		// 				});
		// 			}
		// 		}
		// 	}
		// }
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

	const htmlReport = await uploadFile(
		join(process.cwd(), "playwright-report", "index.html"),
	);

	meta.push({
		type: "section",
		text: {
			type: "mrkdwn",
			text: `\n*HTML Results* :\t'<${htmlReport?.files[0]?.files[0]?.permalink}|📊>'`,
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
