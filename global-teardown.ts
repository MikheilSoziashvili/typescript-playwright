import { clearDirectoryContent } from "./core/utils";

async function globalTeardown() {
	clearDirectoryContent("core/.auth");
}

export default globalTeardown;
