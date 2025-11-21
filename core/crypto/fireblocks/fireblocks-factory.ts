import fs from "node:fs";
import path from "node:path";
import { FireblocksSDK } from "fireblocks-sdk";
import { fireblocks as fireblocksConfig } from "configuration";
import { FireblocksConfigError } from "@core/errors/fireblocks-errors";
import { FireblocksClient } from "./fireblocks-client";
import { createSecret } from "@core/utils/utils";

function initializeFireblocksSDK(): FireblocksSDK {
	const envKey = process.env.FIREBLOCKS_SECRET_KEY;
	const envPath = process.env.FIREBLOCKS_SECRET_KEY_PATH;

	const { apiKey, secretKeyPath: configPath, baseUrl } = fireblocksConfig;

	const effectivePath = envPath ?? configPath;
	if (!effectivePath) {
		throw new FireblocksConfigError(
			"Missing Fireblocks private key path. Set FIREBLOCKS_SECRET_KEY_PATH or fireblocksConfig.secretKeyPath.",
		);
	}

	if (envKey) {
		createSecret(envKey, effectivePath);
	}

	const absolutePath = path.isAbsolute(effectivePath)
		? effectivePath
		: path.join(process.cwd(), effectivePath);

	if (!fs.existsSync(absolutePath)) {
		throw new FireblocksConfigError(
			`Fireblocks private key not found at: ${absolutePath}`,
		);
	}

	const privateKey = fs.readFileSync(absolutePath, "utf8");
	return new FireblocksSDK(privateKey, apiKey, baseUrl);
}

export function createFireblocksClient(assetId: string): FireblocksClient {
	const sdk = initializeFireblocksSDK();
	return new FireblocksClient(sdk, assetId);
}

export function createUsdtClient(): FireblocksClient {
	return createFireblocksClient(fireblocksConfig.usdtAssetId);
}

export function createEthClient(): FireblocksClient {
	return createFireblocksClient(fireblocksConfig.ethAssetId);
}

export function createSolClient(): FireblocksClient {
	return createFireblocksClient(fireblocksConfig.solAssetId);
}

export function createTrxClient(): FireblocksClient {
	return createFireblocksClient(fireblocksConfig.trxAssetId);
}

export function createUsdtTrxClient(): FireblocksClient {
	return createFireblocksClient(fireblocksConfig.usdtTrxAssetId);
}

export function createUsdcEthClient(): FireblocksClient {
	return createFireblocksClient(fireblocksConfig.usdcEthAssetId);
}
