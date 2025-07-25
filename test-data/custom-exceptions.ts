export class CsvFileLoadError extends Error {
	public filePath?: string;
	public originalError?: Error;

	constructor(message: string, filePath?: string, originalError?: Error) {
		super(message, { cause: originalError });
		this.name = "CsvFileLoadError";
		this.filePath = filePath;
		this.originalError = originalError;
	}
}

export class CsvParseError extends Error {
	constructor(message: string, originalError?: Error) {
		super(message, { cause: originalError });
		this.name = "CsvParseError";
	}
}
