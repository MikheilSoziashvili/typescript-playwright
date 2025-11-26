import {
	VisualAutomationDefaults,
	VisualAutomationPolling,
	VisualComparisonThreshold,
} from "@constants/visual-automation";
import {
	ImageLoadError,
	ImageNotFoundError,
	VisualChangeDetectionError,
} from "@core/errors/visual-automation-errors";
import { Match, MatchOptions, Region } from "@core/types/visual-types";
import {
	calculateAdaptiveStep,
	calculateSearchBounds,
	compareRegion,
	validateTemplateBounds,
} from "@core/utils/visual-comparison-utils";
import { FileFormat } from "@enums/playwright/fileFormat";
import { MouseButton } from "@enums/playwright/mouseButton";
import { Timeout } from "@enums/timeout";
import { VisualMetrics } from "@enums/visual/visualMetrics";
import { logger } from "@logger/logger";
import { Locator, Page, expect } from "@playwright/test";
import { step } from "decorators/step";
import * as fs from "fs/promises";
import { PNG } from "pngjs";
import { BaseVisualMap } from "./base-visual-map";

type Constructor<T> = new (page: Page) => T;

export abstract class BaseVisualPage<T extends BaseVisualMap> {
	protected _page: Page;
	protected _map: T;
	private imageCache: Map<string, Buffer> = new Map<string, Buffer>();
	private performanceMetrics: Map<string, number[]> = new Map<
		string,
		number[]
	>();

	public constructor(page: Page, map: T) {
		this._page = page;
		this._map = map;
	}

	public get page(): Page {
		return this._page;
	}

	public get map(): T {
		return this._map;
	}

	abstract assertThat(): void;

	abstract steps(): void;

	/**
	 * Updates the BaseVisualPage with a new Page instance.
	 * @param newPage The new Page instance.
	 */
	public init(newPage: Page): void {
		this._page = newPage;
		this._map = new (this._map.constructor as Constructor<T>)(newPage);
	}

	@step("Find image on screen")
	public async visualFind(
		templatePath: string,
		options: MatchOptions = {},
	): Promise<Match | null> {
		const {
			timeout = Timeout.MEDIUM,
			region,
			threshold = VisualComparisonThreshold.NORMAL,
		} = options;

		const startTime = Date.now();
		let bestMatch: Match | null = null;

		while (Date.now() - startTime < timeout) {
			try {
				const screenshot = await this.captureScreen(region);
				const match = await this.findInScreenshot(
					screenshot,
					templatePath,
					threshold,
				);

				if (match.found) {
					this.recordMetric(
						VisualMetrics.FIND_SUCCESS,
						Date.now() - startTime,
					);
					return match;
				}

				if (!bestMatch || match.confidence > bestMatch.confidence) {
					bestMatch = match;
				}
			} catch (error) {
				logger.warn(
					`Error during image search for ${templatePath}: ${
						error instanceof Error ? error.message : String(error)
					}`,
				);
			}

			await new Promise((res) =>
				setTimeout(res, VisualAutomationPolling.INTERVAL_MS),
			);
		}

		this.recordMetric(VisualMetrics.FIND_TIMEOUT, Date.now() - startTime);
		return null;
	}

	@step("Wait for image to appear")
	public async visualWaitFor(
		templatePath: string,
		options: MatchOptions = {},
	): Promise<Match> {
		const match = await this.visualFind(templatePath, options);

		if (!match) {
			throw new ImageNotFoundError(
				templatePath,
				options.timeout || Timeout.MEDIUM,
			);
		}

		return match;
	}

	@step("Click on image")
	public async visualClick(
		templatePath: string,
		options: MatchOptions = {},
	): Promise<void> {
		const match = await this.visualWaitFor(templatePath, options);
		const centerX = match.x + match.width / 2;
		const centerY = match.y + match.height / 2;

		logger.info(`Clicking image at coordinates (${centerX}, ${centerY})`);
		await this._page.mouse.click(centerX, centerY);
	}

	@step("Double click on image")
	public async visualDoubleClick(
		templatePath: string,
		options: MatchOptions = {},
	): Promise<void> {
		const match = await this.visualWaitFor(templatePath, options);
		const centerX = match.x + match.width / 2;
		const centerY = match.y + match.height / 2;

		logger.info(
			`Double clicking image at coordinates (${centerX}, ${centerY})`,
		);
		await this._page.mouse.dblclick(centerX, centerY);
	}

	@step("Right click on image")
	public async visualRightClick(
		templatePath: string,
		options: MatchOptions = {},
	): Promise<void> {
		const match = await this.visualWaitFor(templatePath, options);
		const centerX = match.x + match.width / 2;
		const centerY = match.y + match.height / 2;

		logger.info(
			`Right clicking image at coordinates (${centerX}, ${centerY})`,
		);
		await this._page.mouse.click(centerX, centerY, {
			button: MouseButton.RIGHT,
		});
	}

	@step("Hover over image")
	public async visualHover(
		templatePath: string,
		options: MatchOptions = {},
	): Promise<void> {
		const match = await this.visualWaitFor(templatePath, options);
		const centerX = match.x + match.width / 2;
		const centerY = match.y + match.height / 2;

		logger.info(
			`Hovering over image at coordinates (${centerX}, ${centerY})`,
		);
		await this._page.mouse.move(centerX, centerY);
	}

	@step("Drag and drop between images")
	public async visualDragDrop(
		fromTemplatePath: string,
		toTemplatePath: string,
		options: MatchOptions = {},
	): Promise<void> {
		const fromMatch = await this.visualWaitFor(fromTemplatePath, options);
		const toMatch = await this.visualWaitFor(toTemplatePath, options);

		const fromCenterX = fromMatch.x + fromMatch.width / 2;
		const fromCenterY = fromMatch.y + fromMatch.height / 2;
		const toCenterX = toMatch.x + toMatch.width / 2;
		const toCenterY = toMatch.y + toMatch.height / 2;

		logger.info(
			`Dragging from (${fromCenterX}, ${fromCenterY}) to (${toCenterX}, ${toCenterY})`,
		);

		await this._page.mouse.move(fromCenterX, fromCenterY);
		await this._page.mouse.down();
		await this._page.mouse.move(toCenterX, toCenterY);
		await this._page.mouse.up();
	}

	@step("Check if image exists")
	public async visualExists(
		templatePath: string,
		options: MatchOptions = {},
	): Promise<boolean> {
		const quickOptions = {
			...options,
			timeout:
				options.timeout || VisualAutomationDefaults.QUICK_CHECK_TIMEOUT,
		};
		const match = await this.visualFind(templatePath, quickOptions);
		return match !== null;
	}

	@step("Verify element appearance")
	public async visualVerifyAppearance(
		locator: Locator,
		snapshotName: string,
		options: MatchOptions = {},
	): Promise<void> {
		logger.info(`Verifying appearance for snapshot: ${snapshotName}`);
		await expect(locator).toHaveScreenshot(snapshotName, {
			maxDiffPixelRatio:
				options.maxDiffPixelRatio || VisualComparisonThreshold.STRICT,
			maxDiffPixels: options.maxDiffPixels,
			threshold: options.threshold || VisualComparisonThreshold.RELAXED,
		});
	}

	@step("Verify page appearance")
	public async visualVerifyPage(
		snapshotName: string,
		options: MatchOptions = {},
	): Promise<void> {
		logger.info(`Verifying page appearance for snapshot: ${snapshotName}`);
		await expect(this._page).toHaveScreenshot(snapshotName, {
			maxDiffPixelRatio:
				options.maxDiffPixelRatio || VisualComparisonThreshold.STRICT,
			maxDiffPixels: options.maxDiffPixels,
			threshold: options.threshold || VisualComparisonThreshold.RELAXED,
			fullPage: true,
		});
	}

	@step("Find all image occurrences")
	public async visualFindAll(
		templatePath: string,
		options: MatchOptions = {},
	): Promise<Match[]> {
		logger.info(`Finding all occurrences of ${templatePath}`);
		const screenshot = await this.captureScreen(options.region);
		const template = await this.loadImage(templatePath);

		const matches = this.findAllInScreenshot(
			screenshot,
			template,
			options.threshold || VisualComparisonThreshold.NORMAL,
		);

		logger.info(`Found ${matches.length} occurrences`);
		return matches;
	}

	@step("Wait for visual change")
	public async waitForVisualChange(region: Region): Promise<void> {
		logger.info(
			`Waiting for visual change in region (${region.x}, ${region.y}, ${region.width}x${region.height})`,
		);

		const initialScreenshot = await this.captureScreen(region);

		await this._page.waitForTimeout(VisualAutomationPolling.INTERVAL_MS);

		const newScreenshot = await this.captureScreen(region);
		const changed = !initialScreenshot.equals(newScreenshot);

		if (!changed) {
			throw new VisualChangeDetectionError(region);
		}

		logger.info("Visual change detected");
	}

	@step("Capture screen")
	protected async captureScreen(region?: Region): Promise<Buffer> {
		if (region) {
			return this._page.screenshot({
				clip: region,
				type: FileFormat.PNG,
			});
		}
		return this._page.screenshot({
			type: FileFormat.PNG,
			fullPage: false,
		});
	}

	@step("Load image")
	protected async loadImage(imagePath: string): Promise<Buffer> {
		const cached = this.imageCache.get(imagePath);
		if (cached) {
			return cached;
		}

		try {
			const imageBuffer = await fs.readFile(imagePath);
			this.imageCache.set(imagePath, imageBuffer);
			return imageBuffer;
		} catch (error) {
			throw new ImageLoadError(
				imagePath,
				error instanceof Error ? error : new Error(String(error)),
			);
		}
	}

	private recordMetric(metricName: string, duration: number): void {
		if (!this.performanceMetrics.has(metricName)) {
			this.performanceMetrics.set(metricName, []);
		}
		const metrics = this.performanceMetrics.get(metricName);
		if (metrics) {
			metrics.push(duration);
		}
	}

	public getPerformanceMetrics(
		metricName?: string,
	): Record<string, number[]> {
		if (metricName) {
			return {
				[metricName]: this.performanceMetrics.get(metricName) || [],
			};
		}
		return Object.fromEntries(this.performanceMetrics);
	}

	public clearCache(): void {
		this.imageCache.clear();
		logger.info("Image cache cleared");
	}

	@step("Find image in screenshot")
	protected async findInScreenshot(
		screenshot: Buffer,
		templatePath: string,
		threshold: number,
	): Promise<Match> {
		const screenImg = PNG.sync.read(screenshot);
		const templateImg = PNG.sync.read(await this.loadImage(templatePath));

		validateTemplateBounds(
			screenImg.width,
			screenImg.height,
			templateImg.width,
			templateImg.height,
		);

		let bestMatch: Match = {
			x: 0,
			y: 0,
			width: templateImg.width,
			height: templateImg.height,
			confidence: 0,
			found: false,
		};

		const stepSize = calculateAdaptiveStep(templateImg.width);

		for (
			let y = 0;
			y <= screenImg.height - templateImg.height;
			y += stepSize
		) {
			for (
				let x = 0;
				x <= screenImg.width - templateImg.width;
				x += stepSize
			) {
				const confidence = compareRegion(
					screenImg,
					templateImg,
					x,
					y,
					VisualAutomationDefaults.COLOR_THRESHOLD,
				);

				if (confidence > bestMatch.confidence) {
					bestMatch = {
						x: x,
						y: y,
						width: templateImg.width,
						height: templateImg.height,
						confidence: confidence,
						found: confidence >= 1 - threshold,
					};

					if (
						confidence >=
						VisualAutomationDefaults.EARLY_EXIT_CONFIDENCE
					) {
						return bestMatch;
					}
				}
			}
		}

		if (bestMatch.confidence > VisualAutomationDefaults.MIN_CONFIDENCE) {
			bestMatch = this.refinedScan(
				screenImg,
				templateImg,
				bestMatch.x,
				bestMatch.y,
				stepSize,
				threshold,
			);
		}

		return bestMatch;
	}

	private refinedScan(
		screen: PNG,
		template: PNG,
		centerX: number,
		centerY: number,
		originalStep: number,
		threshold: number,
	): Match {
		let bestMatch: Match = {
			x: centerX,
			y: centerY,
			width: template.width,
			height: template.height,
			confidence: 0,
			found: false,
		};

		const searchRadius = originalStep;
		const bounds = calculateSearchBounds(
			centerX,
			centerY,
			searchRadius,
			screen.width,
			screen.height,
			template.width,
			template.height,
		);

		for (let y = bounds.startY; y <= bounds.endY; y++) {
			for (let x = bounds.startX; x <= bounds.endX; x++) {
				const confidence = compareRegion(
					screen,
					template,
					x,
					y,
					VisualAutomationDefaults.COLOR_THRESHOLD,
				);

				if (confidence > bestMatch.confidence) {
					bestMatch = {
						x: x,
						y: y,
						width: template.width,
						height: template.height,
						confidence: confidence,
						found: confidence >= 1 - threshold,
					};
				}
			}
		}

		return bestMatch;
	}

	private findAllInScreenshot(
		screenshot: Buffer,
		template: Buffer,
		threshold: number,
	): Match[] {
		const screenImg = PNG.sync.read(screenshot);
		const templateImg = PNG.sync.read(template);
		const matches: Match[] = [];

		const stepSize = Math.max(2, Math.floor(templateImg.width / 8));

		for (
			let y = 0;
			y <= screenImg.height - templateImg.height;
			y += stepSize
		) {
			for (
				let x = 0;
				x <= screenImg.width - templateImg.width;
				x += stepSize
			) {
				const confidence = compareRegion(
					screenImg,
					templateImg,
					x,
					y,
					VisualAutomationDefaults.COLOR_THRESHOLD,
				);

				if (confidence >= 1 - threshold) {
					const overlapThreshold =
						(templateImg.width / 2) *
						VisualAutomationDefaults.OVERLAP_THRESHOLD_RATIO;
					const overlaps = matches.some(
						(m) =>
							Math.abs(m.x - x) < overlapThreshold &&
							Math.abs(m.y - y) < overlapThreshold,
					);

					if (!overlaps) {
						matches.push({
							x: x,
							y: y,
							width: templateImg.width,
							height: templateImg.height,
							confidence: confidence,
							found: true,
						});
					}
				}
			}
		}

		return matches;
	}

	/**
	 * Click on visual element
	 * @param templatePath - Path to template image
	 * @param options - Match options
	 */
	@step("Click on visual element")
	public async clickVisualElement(
		templatePath: string,
		options?: MatchOptions,
	): Promise<void> {
		logger.info(`Clicking element: ${templatePath}`);
		await this.visualClick(templatePath, options);
	}

	/**
	 * Double click on visual element
	 * @param templatePath - Path to template image
	 * @param options - Match options
	 */
	@step("Double click on visual element")
	public async doubleClickVisualElement(
		templatePath: string,
		options?: MatchOptions,
	): Promise<void> {
		logger.info(`Double clicking element: ${templatePath}`);
		await this.visualDoubleClick(templatePath, options);
	}

	/**
	 * Right click on visual element
	 * @param templatePath - Path to template image
	 * @param options - Match options
	 */
	@step("Right click on visual element")
	public async rightClickVisualElement(
		templatePath: string,
		options?: MatchOptions,
	): Promise<void> {
		logger.info(`Right clicking element: ${templatePath}`);
		await this.visualRightClick(templatePath, options);
	}

	/**
	 * Hover over visual element
	 * @param templatePath - Path to template image
	 * @param options - Match options
	 */
	@step("Hover over visual element")
	public async hoverVisualElement(
		templatePath: string,
		options?: MatchOptions,
	): Promise<void> {
		logger.info(`Hovering over element: ${templatePath}`);
		await this.visualHover(templatePath, options);
	}

	/**
	 * Drag and drop visual elements
	 * @param fromTemplatePath - Path to source element template
	 * @param toTemplatePath - Path to target element template
	 * @param options - Match options
	 */
	@step("Drag and drop visual elements")
	public async dragDropVisualElements(
		fromTemplatePath: string,
		toTemplatePath: string,
		options?: MatchOptions,
	): Promise<void> {
		logger.info(`Dragging from ${fromTemplatePath} to ${toTemplatePath}`);
		await this.visualDragDrop(fromTemplatePath, toTemplatePath, options);
	}

	/**
	 * Find visual element
	 * @param templatePath - Path to template image
	 * @param options - Match options
	 * @returns Match result or null if not found
	 */
	@step("Find visual element")
	public async findVisualElement(
		templatePath: string,
		options?: MatchOptions,
	): Promise<Match | null> {
		logger.info(`Finding element: ${templatePath}`);
		return this.visualFind(templatePath, options);
	}

	/**
	 * Wait for visual element to appear
	 * @param templatePath - Path to template image
	 * @param options - Match options
	 * @returns Match result
	 */
	@step("Wait for visual element")
	public async waitForVisualElement(
		templatePath: string,
		options?: MatchOptions,
	): Promise<Match> {
		logger.info(`Waiting for element: ${templatePath}`);
		return this.visualWaitFor(templatePath, options);
	}
}
