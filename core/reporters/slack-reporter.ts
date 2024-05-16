import { ReporterDescription } from "@playwright/test";
import { Block, KnownBlock } from "@slack/types";
import { SummaryResults } from "playwright-slack-report/dist/src";

const SlackReporterEmoji = {
	passed: ":white_check_mark:",
	failed: ":x:",
	timedOut: ":timeout-clock:",
	interrupted: ":fast_forward:",
	skipped: ":fast_forward:",
	playwright: ":performing_arts:",
	flaky: ":warning:",
};

export function slackReporterConfig(
	slackConfig: Record<string, string>,
	metaData: { key: string; value: string }[],
): ReporterDescription {
	return [
		"./node_modules/playwright-slack-report/dist/src/SlackReporter.js",
		{
			// channels: ["e2e-tests-reporting"],
			slackWebHookUrl: slackConfig.webHookUrl,
			sendResults: "always",
			layout: generateCustomLayout,
			meta: metaData,
		},
	];
}

export function generateCustomLayout(
	summaryResults: SummaryResults,
): (Block | KnownBlock)[] {
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

	//TODO: Add attachments, OAuth token creation pending
	// const assets: string[] = [];

	// if (t.attachments) {
	// 	for (const a of t.attachments) {
	// 		// Upload failed tests screenshots and videos to the service of your choice
	// 		// In my case I upload the to S3 bucket
	// 		const permalink = await uploadFile(
	// 			a.path,
	// 			`${t.suiteName}--${t.name}`
	// 				.replace(/\W/gi, "-")
	// 				.toLowerCase(),
	// 		);

	// 		if (permalink) {
	// 			let icon = "";
	// 			if (a.name === "screenshot") {
	// 				icon = "📸";
	// 			} else if (a.name === "video") {
	// 				icon = "🎥";
	// 			}

	// 			assets.push(
	// 				`${icon}  See the <${permalink}|${a.name}>`,
	// 			);
	// 		}
	// 	}
	// }

	// if (assets.length > 0) {
	// 	fails.push({
	// 		type: "context",
	// 		elements: [{ type: "mrkdwn", text: assets.join("\n") }],
	// 	});
	// }
	// }

	return [
		header,
		summary,
		{ type: "divider" },
		...testDetails,
		{ type: "divider" },
		...meta,
	];
}
