import {
	storageStateSuperadmin,
	storageStateUser1,
} from "../fixtures/auth-fixtures";
import { test } from "../fixtures/fixtures";

test.describe("User1", () => {
	test.use(storageStateUser1);
	test("TEST1 IN DESCRIBE", async ({ homePage, page }) => {
		await homePage.navigate();
		await page.waitForTimeout(30000);
		console.log("TEST1 IN DESCRIBE");
	});

	test("TEST2 IN DESCRIBE", async ({ homePage, page }) => {
		await homePage.navigate();
		await page.waitForTimeout(30000);
		console.log("TEST2 IN DESCRIBE");
	});
});

test.describe("Superadmin", () => {
	test.use(storageStateSuperadmin);
	test("TEST3 IN DESCRIBE", async ({ homePage, page }) => {
		await homePage.navigate();
		await page.waitForTimeout(30000);
		console.log("TEST3 IN DESCRIBE");
	});

	test("TEST4 IN DESCRIBE", async ({ homePage, page }) => {
		await homePage.navigate();
		await page.waitForTimeout(30000);
		console.log("TEST4 IN DESCRIBE");
	});
});
