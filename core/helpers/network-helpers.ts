import { Page, Route } from "@playwright/test";

/**
 * Adds a delay to a specific network request route before continuing it.
 * Useful for simulating slow network responses in E2E tests.
 */
export const delayRoute =
	(urlPart: string, ms: number) =>
	(page: Page): Promise<void> =>
		page.route(urlPart, async (route: Route) => {
			await new Promise((res) => setTimeout(res, ms));
			await route.continue();
		});
