import * as path from "path";

export class BaseVisualMap {
	protected baseAssetPath: string;

	public constructor(assetPath: string) {
		this.baseAssetPath = assetPath;
	}

	/**
	 * Get full path to screenshot template
	 * @param templateName - Name of the template
	 * @returns Full path to template with .png extension
	 */
	protected getTemplatePath(templateName: string): string {
		return path.join(this.baseAssetPath, `${templateName}.png`);
	}

	/**
	 * Get full path to screenshot template with custom extension
	 * @param templateName - Name of the template
	 * @param extension - File extension
	 * @returns Full path to template with specified extension
	 */
	protected getTemplatePathWithExtension(
		templateName: string,
		extension: string,
	): string {
		return path.join(this.baseAssetPath, `${templateName}.${extension}`);
	}

	/**
	 * Verify template path exists and is valid
	 * @param templatePath - Path to verify
	 * @returns The verified template path
	 * @throws Error if template path is empty
	 */
	protected verifyTemplatePath(templatePath: string): string {
		if (!templatePath) {
			throw new Error("Template path cannot be empty");
		}
		return templatePath;
	}
}
