/**
 * Converts display value to DOM value for special slider cases.
 * 
 * @param target - The target value in display units
 * @param min - Minimum slider value
 * @param max - Maximum slider value
 * @returns The adjusted target value for DOM manipulation
 */
export function getAdjustedTargetValue(target: number, min: number, max: number): number {
	if (max === 8 && min === 0 && target >= 8 && target <= 16) {
		return target - 8;
	}
	return target;
}

/**
 * Ensures value stays within valid bounds using min/max constraints.
 * 
 * @param value - The value to bound
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns The bounded value
 */
export function boundValue(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Calculates percentage position within slider range (0.0 to 1.0).
 * 
 * @param value - The current value
 * @param min - Minimum slider value
 * @param max - Maximum slider value
 * @returns The percentage position as a decimal (0.0 to 1.0)
 */
export function calculatePercentage(value: number, min: number, max: number): number {
	return (value - min) / (max - min);
}

/**
 * Converts DOM value to display value for special slider cases.
 * 
 * @param domValue - The value from DOM attributes
 * @param min - Minimum slider value
 * @param max - Maximum slider value
 * @returns The display value for user interface
 */
export function getDisplayValue(domValue: number, min: number, max: number): number {
	if (max === 8 && min === 0) {
		return domValue + 8;
	}
	return domValue;
}

/**
 * Calculates pixel coordinate from percentage within slider track.
 * 
 * @param sliderBox - Object containing x position and width of slider
 * @param percentage - Position as percentage (0.0 to 1.0)
 * @returns The absolute X coordinate in pixels
 */
export function calculateCoordinate(sliderBox: { x: number; width: number }, percentage: number): number {
	return sliderBox.x + sliderBox.width * percentage;
}
