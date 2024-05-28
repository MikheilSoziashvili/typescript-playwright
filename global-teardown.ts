import { clearDirectoryContent } from "@core/utils";

async function globalTeardown(): Promise<void> {
	await clearDirectoryContent("core/.auth", ["auth.json"]);
}

export default globalTeardown;
