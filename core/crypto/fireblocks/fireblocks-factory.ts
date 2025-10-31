import fs from "node:fs";
import path from "node:path";
import { FireblocksSDK } from "fireblocks-sdk";
import { fireblocks as fireblocksConfig } from "configuration";
import { FireblocksConfigError } from "@core/errors/fireblocks-errors";
import { FireblocksClient } from "./fireblocks-client";

function initializeFireblocksSDK(): FireblocksSDK {
	const { apiKey, secretKeyPath, baseUrl } = fireblocksConfig;

	const absolutePath = path.isAbsolute(secretKeyPath)
		? secretKeyPath
		: path.join(process.cwd(), secretKeyPath);

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
