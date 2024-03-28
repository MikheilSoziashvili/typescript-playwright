import * as winston from "winston";
import * as Configuration from "../configuration";

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
