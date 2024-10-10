import { BaseAsserter } from "@base/base-asserter";
import { BlogCategoryPage } from "./blog-category-page";
import { expect, Locator } from "@playwright/test";

export class BlogCategoryPageAsserter extends BaseAsserter<BlogCategoryPage> {
	public constructor(page: BlogCategoryPage) {
		super(page);
	}

	public async isBlogCategoryNameDisplayedInTitle(
		blogCategoryName: string,
	): Promise<void> {
		const actualTitle = (
			await this.gamdomPage.map.blogCategoryViewTitle.innerText()
		).toLocaleLowerCase();
		expect(actualTitle).toBe(blogCategoryName.toLocaleLowerCase());
	}

	public async postElementTitleIs(
		selector: Locator,
		title: string,
		timeout?: number,
	): Promise<void> {
		await selector.first().waitFor({ timeout });
		const elementCount = await selector.count();
		let titleFound = false;

		for (let i = 0; i < elementCount; i++) {
			const currentTitle = await selector.nth(i).textContent();
			if (currentTitle?.includes(title)) {
				titleFound = true;
				break;
			}
		}

		expect(titleFound).toBe(true);
	}

	public async postTitleIs(title: string, timeout?: number): Promise<void> {
		const postTitles = this.gamdomPage.map.postTitle;
		await this.postElementTitleIs(postTitles, title, timeout);
	}

	public async postSubTitleIs(
		title: string,
		timeout?: number,
	): Promise<void> {
		const postSubTitles = this.gamdomPage.map.postSubTitle;
		await this.postElementTitleIs(postSubTitles, title, timeout);
	}

	public async isPostDisplayed(
		title: string,
		subTitle: string,
		timeout?: number,
	): Promise<void> {
		await this.postTitleIs(title, timeout);
		await this.postSubTitleIs(subTitle, timeout);
	}
}
