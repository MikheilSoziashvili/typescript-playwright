export const REPORT_HTML_DIR_NAME = "playwright-report";
export const REPORT_ZIP_FILE_NAME = `${REPORT_HTML_DIR_NAME}.zip`;
export const REPORT_SLACK_CHANNEL_ID = "C0751MKCDSA";
export const SlackReporterEmoji = {
	passed: ":white_check_mark:",
	failed: ":x:",
	timedOut: ":timeout-clock:",
	interrupted: ":fast_forward:",
	skipped: ":fast_forward:",
	playwright: ":performing_arts:",
	flaky: ":warning:",
};
export const ARCHIVER_ZLIB_LEVEL = 9;
