export class VisualAutomationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "VisualAutomationError";
	}
}

export class ImageNotFoundError extends VisualAutomationError {
	constructor(templatePath: string, timeout: number, confidence?: number) {
		const confidenceMsg =
			confidence !== undefined
				? ` (best match confidence: ${(confidence * 100).toFixed(2)}%)`
				: "";
		super(
			`Image not found: ${templatePath} within ${timeout}ms${confidenceMsg}`,
		);
		this.name = "ImageNotFoundError";
	}
}

export class ImageLoadError extends VisualAutomationError {
	constructor(imagePath: string, originalError: Error) {
		super(`Failed to load image: ${imagePath} - ${originalError.message}`);
		this.name = "ImageLoadError";
	}
}

export class VisualComparisonError extends VisualAutomationError {
	constructor(
		message: string,
		public readonly details?: Record<string, unknown>,
	) {
		super(message);
		this.name = "VisualComparisonError";
	}
}

export class VisualChangeDetectionError extends VisualAutomationError {
	constructor(region?: {
		x: number;
		y: number;
		width: number;
		height: number;
	}) {
		const regionMsg = region
			? ` in region (${region.x}, ${region.y}, ${region.width}x${region.height})`
			: "";
		super(`No visual change detected${regionMsg}`);
		this.name = "VisualChangeDetectionError";
	}
}
