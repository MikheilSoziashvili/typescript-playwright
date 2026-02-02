import { LogLevel } from "@enums/log-levels";
import { logger } from "@logger/logger";

export abstract class BaseTestFlow {
	protected readonly flowName: string;

	protected constructor(flowName?: string) {
		this.flowName = flowName ?? this.constructor.name;
	}

	protected log(message: string, level: LogLevel = LogLevel.INFO): void {
		logger[level](`[FLOW:${this.flowName}] ${message}`);
	}
}
