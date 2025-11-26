import { expect } from "@playwright/test";
import { BaseVisualPage } from "./base-visual-page";
import { BaseVisualMap } from "./base-visual-map";
import { logger } from "@logger/logger";
import { step } from "decorators/step";
import { Match, MatchOptions } from "@core/types/visual-types";

export class BaseVisualAsserter<T extends BaseVisualMap = BaseVisualMap> {
	protected visualPage: BaseVisualPage<T>;
	public constructor(visualPage: BaseVisualPage<T>) {
		this.visualPage = visualPage;
	}

	@step("Verify image is found")
	public async imageFound(
		templatePath: string,
		options?: MatchOptions,
	): Promise<Match | null> {
		const match = await this.visualPage.visualFind(templatePath, options);
		expect(match?.found, `Image not found: ${templatePath}`).toBe(true);
		expect(match, `Image match not found: ${templatePath}`).not.toBeNull();
		logger.info(`Image found: ${templatePath}`);
		return match;
	}

	@step("Verify image is not found")
	public async imageNotFound(
		templatePath: string,
		options?: MatchOptions,
	): Promise<void> {
		const match = await this.visualPage.visualFind(templatePath, options);
		expect(match?.found, `Image found: ${templatePath}`).toBe(false);
		logger.info(`Image not found: ${templatePath}`);
	}

	@step("Verify image exists")
	public async imageExists(
		templatePath: string,
		options?: MatchOptions,
	): Promise<void> {
		const exists = await this.visualPage.visualExists(
			templatePath,
			options,
		);
		expect(exists, `Image not found: ${templatePath}`).toBe(true);
		logger.info(`Image exists: ${templatePath}`);
	}

	@step("Verify image does not exist")
	public async imageDoesNotExist(
		templatePath: string,
		options?: MatchOptions,
	): Promise<void> {
		const exists = await this.visualPage.visualExists(
			templatePath,
			options,
		);
		expect(exists, `Image found: ${templatePath}`).toBe(false);
		logger.info(`Image does not exist: ${templatePath}`);
	}

	@step("Verify match confidence")
	public async matchConfidence(
		templatePath: string,
		minConfidence: number,
		options?: MatchOptions,
	): Promise<void> {
		const match = await this.visualPage.visualFind(templatePath, options);
		expect(
			match?.confidence,
			`Low confidence for ${templatePath}`,
		).toBeGreaterThanOrEqual(minConfidence);
		logger.info(`Match confidence >= ${minConfidence} for ${templatePath}`);
	}
}
