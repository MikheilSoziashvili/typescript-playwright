import { PNG } from "pngjs";
import { VisualComparisonError } from "@core/errors/visual-automation-errors";

/**
 * Compares a template region with a screenshot region using pixel-by-pixel color matching.
 * Iterates through each pixel in the template and compares RGB values against the screen region.
 * @param screen - PNG image data of the full screenshot
 * @param template - PNG image data of the template to match
 * @param offsetX - X coordinate offset in the screen where comparison starts
 * @param offsetY - Y coordinate offset in the screen where comparison starts
 * @param colorThreshold - Maximum allowed color difference per channel (0-255) for pixel match
 * @returns Confidence score between 0 and 1 (1 = perfect match, 0 = no match)
 */
export function compareRegion(
	screen: PNG,
	template: PNG,
	offsetX: number,
	offsetY: number,
	colorThreshold: number,
): number {
	let matchingPixels = 0;
	const totalPixels = template.width * template.height;

	for (let y = 0; y < template.height; y++) {
		for (let x = 0; x < template.width; x++) {
			const templateIdx = (template.width * y + x) << 2;
			const screenIdx =
				(screen.width * (y + offsetY) + (x + offsetX)) << 2;

			const rDiff = Math.abs(
				template.data[templateIdx] - screen.data[screenIdx],
			);
			const gDiff = Math.abs(
				template.data[templateIdx + 1] - screen.data[screenIdx + 1],
			);
			const bDiff = Math.abs(
				template.data[templateIdx + 2] - screen.data[screenIdx + 2],
			);

			if (
				rDiff < colorThreshold &&
				gDiff < colorThreshold &&
				bDiff < colorThreshold
			) {
				matchingPixels++;
			}
		}
	}

	return matchingPixels / totalPixels;
}

/**
 * Calculates adaptive step size for efficient template scanning.
 * Uses 1/10th of template width to balance speed and accuracy.
 * @param templateWidth - Width of the template image in pixels
 * @returns Step size for scanning loop (minimum 1 pixel)
 */
export function calculateAdaptiveStep(templateWidth: number): number {
	return Math.max(1, Math.floor(templateWidth / 10));
}

/**
 * Validates that template dimensions fit within screen bounds.
 * Throws error if template is larger than screen in either dimension.
 * @param screenWidth - Width of the screen in pixels
 * @param screenHeight - Height of the screen in pixels
 * @param templateWidth - Width of the template in pixels
 * @param templateHeight - Height of the template in pixels
 * @throws VisualComparisonError if template exceeds screen dimensions
 */
export function validateTemplateBounds(
	screenWidth: number,
	screenHeight: number,
	templateWidth: number,
	templateHeight: number,
): void {
	if (templateWidth > screenWidth || templateHeight > screenHeight) {
		throw new VisualComparisonError(
			"Template dimensions exceed screen dimensions",
			{
				screen: { width: screenWidth, height: screenHeight },
				template: { width: templateWidth, height: templateHeight },
			},
		);
	}
}

/**
 * Calculates bounded search area for refined template matching.
 * Restricts search to a region around the center point to improve performance.
 * @param centerX - X coordinate of search center
 * @param centerY - Y coordinate of search center
 * @param searchRadius - Distance from center to search in all directions
 * @param screenWidth - Width of the screen in pixels
 * @param screenHeight - Height of the screen in pixels
 * @param templateWidth - Width of the template in pixels
 * @param templateHeight - Height of the template in pixels
 * @returns Object with startX, endX, startY, endY boundaries (clamped to screen bounds)
 */
export function calculateSearchBounds(
	centerX: number,
	centerY: number,
	searchRadius: number,
	screenWidth: number,
	screenHeight: number,
	templateWidth: number,
	templateHeight: number,
): { startX: number; endX: number; startY: number; endY: number } {
	return {
		startX: Math.max(0, centerX - searchRadius),
		endX: Math.min(screenWidth - templateWidth, centerX + searchRadius),
		startY: Math.max(0, centerY - searchRadius),
		endY: Math.min(screenHeight - templateHeight, centerY + searchRadius),
	};
}
