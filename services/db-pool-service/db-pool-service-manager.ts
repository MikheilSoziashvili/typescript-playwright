import { spawn, ChildProcess } from "child_process";
import path from "path";
import { DbPoolServiceApi } from "@api/db-pool-service-api";
import { logger } from "@logger/logger";
import { DbPoolServiceConfiguration } from "@core/types/types";
import { dbPoolServiceConfig } from "configuration";
import { ProcessSignal } from "./enums/signals";
import { HealthStatus } from "./enums/health-statuses";

export class DbServiceManager {
	private serviceProcess: ChildProcess | null = null;

	private readonly scriptPath: string;
	private readonly timeoutMs: number;
	private readonly pollIntervalMs: number;
	private readonly configuration: DbPoolServiceConfiguration;

	private readonly dbPoolServiceApi: DbPoolServiceApi;

	constructor() {
		this.configuration = dbPoolServiceConfig;
		this.timeoutMs = this.configuration.serviceManager.healthCheckTimeout;
		this.pollIntervalMs =
			this.configuration.serviceManager.healthCheckInterval;
		this.dbPoolServiceApi = new DbPoolServiceApi();
		this.scriptPath = path.resolve(__dirname, "./db-pool-server.ts");

		this.registerCleanupHandlers();
	}

	/**
	 * Starts the DB Pool Service by spawning a new Node.js process.
	 * Waits until the service becomes healthy before resolving.
	 *
	 * @throws {Error} If the service is already running.
	 */
	public async start(): Promise<void> {
		if (this.serviceProcess) {
			throw new Error("DB Pool Service is already running");
		}

		this.serviceProcess = spawn(
			"yarn",
			["ts-node", "-r", "tsconfig-paths/register", this.scriptPath],
			{
				stdio: ["inherit", "inherit", "inherit"],
				env: {
					...process.env,
				},
			},
		);

		await this.waitUntilReady();
	}

	/**
	 * Waits for the DB Pool Service to report a healthy status.
	 * Polls the health endpoint until timeout is reached.
	 *
	 * @throws {Error} If the service does not become healthy within the configured timeout.
	 */
	public async waitUntilReady(): Promise<void> {
		const start = Date.now();

		while (Date.now() - start < this.timeoutMs) {
			try {
				const healthResponse = await this.dbPoolServiceApi.getHealth();
				if (
					healthResponse.status === HealthStatus.OK &&
					healthResponse.dbConnection
				) {
					logger.info(
						"[DB Pool Service Manager] DB Pool Service is healthy",
					);
					return;
				}
			} catch {
				logger.warn(
					`[DB Pool Service Manager] DB Pool Service not healthy. Retrying in ${this.pollIntervalMs}ms..`,
				);
			}
			await new Promise((res) => setTimeout(res, this.pollIntervalMs));
		}

		throw new Error(
			`[DB Pool Service Manager] Failed to start DB Pool Service within ${this.timeoutMs}ms`,
		);
	}

	/**
	 * Stops the DB Pool Service by killing the underlying child process.
	 */
	public async stop(): Promise<void> {
		if (this.serviceProcess) {
			this.serviceProcess.kill();
			this.serviceProcess = null;
			logger.info("[DB Pool Service Manager] DB Pool Service stopped");
		}
	}

	/**
	 * Checks if the DB Pool Service is currently running.
	 *
	 * @returns `true` if the service process is active; otherwise, `false`.
	 */
	public isRunning(): boolean {
		return this.serviceProcess !== null;
	}

	/**
	 * Registers a handler for the given OS signal to perform cleanup before exiting.
	 *
	 * @param signal - The OS signal to handle (e.g., "SIGINT", "SIGTERM").
	 */
	private handleSignal(signal: NodeJS.Signals): void {
		process.on(signal, () => {
			void (async () => {
				logger.warn(
					`[DB Pool Service Manager] Received ${signal}, shutting down...`,
				);
				await this.cleanup();
				process.exit(1);
			})();
		});
	}

	/**
	 * Cleans up the service by stopping the running process if it exists.
	 */
	private async cleanup(): Promise<void> {
		if (this.serviceProcess) {
			logger.info("[DB Pool Service Manager] Cleaning up before exit...");
			await this.stop();
		}
	}

	/**
	 * Registers handlers for common shutdown scenarios such as process exit and uncaught exceptions.
	 */
	private registerCleanupHandlers(): void {
		this.handleSignal(ProcessSignal.SIGINT);
		this.handleSignal(ProcessSignal.SIGTERM);

		process.on("exit", () => {
			void this.cleanup();
		});

		process.on("uncaughtException", (err) => {
			logger.warn("[DB Pool Service Manager] Uncaught Exception:", err);
			void (async () => {
				await this.cleanup();
				process.exit(1);
			})();
		});
	}
}
