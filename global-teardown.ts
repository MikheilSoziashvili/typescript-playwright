import { clearDirectoryContent } from "core/utils";

async function globalTeardown(): Promise<void> {
	await clearDirectoryContent("core/.auth");
}

export default globalTeardown;
