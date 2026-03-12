/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as winston from "winston";
import * as Configuration from "../configuration";
import * as fs from "fs";
import * as path from "path";

// TODO: Work in progress
export const logger = winston.createLogger({
	level: Configuration.logLevel,
	format: winston.format.combine(
		winston.format((info) => {
			info.level = info.level.toUpperCase();
			return info;
		})(),
		winston.format.colorize(),
		winston.format.timestamp(),
		winston.format.printf(
			(info) => `[${info.timestamp}] [${info.level}]: ${info.message}`,
		),
	),
	transports: [
		/* This transport will output logs to the console with the specified format
		new winston.transports.Console({
		format: winston.format.simple(), // Optional: formats logs in a simple, readable format
		}),

		Using `yarn playwright test --headed | npx pino-pretty` will display the log like this:
		[11:51:13.662] INFO: message: "Uploading XML report..
		instead of this {"level":"info","message":"Uploading Junit XML report...","timestamp":"2023-12-21T09:28:36.637Z"} */
		new winston.transports.Console(),
	],
});

const API_ERRORS_LOG = path.resolve("api-errors.log");

export function logErrorToFile(message: string): void {
	const timestamp = new Date().toISOString();
	fs.appendFileSync(API_ERRORS_LOG, `[${timestamp}] [ERROR]: ${message}\n`);
}

export function clearApiErrorLog(): void {
	if (fs.existsSync(API_ERRORS_LOG)) {
		fs.unlinkSync(API_ERRORS_LOG);
	}
}

export function getApiErrorLogContent(): string {
	if (fs.existsSync(API_ERRORS_LOG)) {
		const content = fs.readFileSync(API_ERRORS_LOG, "utf-8").trim();
		if (content) {
			return content;
		}
	}
	return "";
}
