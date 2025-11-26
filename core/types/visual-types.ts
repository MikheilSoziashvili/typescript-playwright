export type PixelComparisonConfig = {
	colorThreshold: number;
	minConfidence: number;
};

export type MatchOptions = {
	maxDiffPixelRatio?: number;
	maxDiffPixels?: number;
	timeout?: number;
	region?: Region;
	threshold?: number;
};

export type Region = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type Match = {
	x: number;
	y: number;
	width: number;
	height: number;
	confidence: number;
	found: boolean;
};
