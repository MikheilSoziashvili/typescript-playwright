/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-expect-error */Needed for slack-reporter

// "due to slack-reporter-cli restrictions we can not have imports for this file and need to disable eslint as follow.
// Please check plugin developer release notes and comments for this issue: ryanrosello-og/playwright-slack-report#86 (comment)"
// https://github.com/ryanrosello-og/playwright-slack-report/issues/86#issuecomment-1911113288
function messageLayoutSlackCli(summaryResults) {
	const meta = [];
	const header = {
		type: "header",
		text: {
			type: "plain_text",
			text: `:playwright: ${process.env.GITHUB_WORKFLOW} Results`,
			emoji: true,
		},
	};
	const flakyTestsCount =
		summaryResults.flaky === undefined ? 0 : summaryResults.flaky;

	const summary = {
		type: "section",
		fields: [
			{
				type: "mrkdwn",
				text: `\n:e2e_passed: Passed: *${summaryResults.passed}* \n:e2e_failed: Failed: *${summaryResults.failed}* \n:e2e_flaky: Flaky: *${flakyTestsCount}* \n:e2e_skipped: Skipped: *${summaryResults.skipped}*`,
			},
		],
	};

	const urlConverted = `${process.env.ENVIRONMENT_URL}`;
	const cleanedUrl = urlConverted.replace(/https?:\/\//, ""); // Removes 'http://' or 'https://'

	summaryResults.meta?.push({
		key: ":gamdom: Environment URL:",
		value: `${cleanedUrl}`,
	});

	summaryResults.meta?.push({
		key: ":e2e_report: Playwright HTML Report:",
		value: `<${process.env.REPORT_URL}|here>`,
	});

	const rpLaunchUrl = buildRpLaunchUrl();
	if (rpLaunchUrl) {
		summaryResults.meta?.push({
			key: ":chart_with_upwards_trend: ReportPortal Launch:",
			value: `<${rpLaunchUrl}|here>`,
		});
	}

	summaryResults.meta?.push({
		key: ":jira: Test Execution:",
		value: process.env.TEST_EXECUTION_ID
			? `<https://gamdom.atlassian.net/browse/${process.env.TEST_EXECUTION_ID}|here>`
			: "N/A",
	});

	if (summaryResults.meta) {
		for (let i = 0; i < summaryResults.meta.length; i += 1) {
			const { key, value } = summaryResults.meta[i];
			meta.push({
				type: "section",
				text: {
					type: "mrkdwn",
					text: `${key} *${value}*`,
				},
			});
		}
	}

	const userName = `:profile_color: Author: *${process.env.USER_NAME}*`;
	const branchName = `:code-branch_color: Branch: *${process.env.BRANCH_NAME}*`;
	const pullRequestMessage =
		process.env.PULL_REQUEST_URL !== "No PR created"
			? `<${process.env.PULL_REQUEST_URL}|here>`
			: `${process.env.PULL_REQUEST_URL}`;
	const pullRequestUrl = `:pull_request_color: Pull request: *${pullRequestMessage}*`;

	const context = {
		type: "context",
		elements: [
			{
				type: "mrkdwn",
				text: `_:icone-github-orange: GitHub details:  ${userName}  ${branchName}  ${pullRequestUrl}_`,
			},
		],
	};

	return [
		header,
		{ type: "divider" },
		summary,
		{ type: "divider" },
		...meta,
		{ type: "divider" },
		context,
		{ type: "divider" },
	];
}

function getPublicRpBaseUrl() {
	if (process.env.RP_PUBLIC_URL)
		return process.env.RP_PUBLIC_URL.replace(/\/+$/, "");
	const endpoint = process.env.RP_ENDPOINT;
	if (!endpoint) return null;
	return new URL(endpoint).origin;
}

function getLaunchId() {
	const envId = process.env.RP_LAUNCH_ID || process.env.CAPTURED_RP_LAUNCH_ID;
	if (envId) return envId;

	try {
		return String(
			require("fs").readFileSync(".rp-launch-uuid", "utf-8"),
		).trim();
	} catch {
		console.warn(
			"Launch UUID is not available. ReportPortal link will be skipped.",
		);
		return null;
	}
}

function buildRpLaunchUrl() {
	const baseUrl = getPublicRpBaseUrl();
	const project = process.env.RP_PROJECT;
	const launchId = getLaunchId();

	if (!baseUrl || !project || !launchId) return null;

	return `${baseUrl}/ui/#${project}/launches/all/${launchId}`;
}

exports.messageLayoutSlackCli = messageLayoutSlackCli;
