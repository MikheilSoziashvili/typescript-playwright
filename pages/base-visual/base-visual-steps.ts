import { BaseVisualPage } from "./base-visual-page";
import { BaseVisualMap } from "./base-visual-map";

/**
 * Base visual steps for canvas-based game automation
 * Combines actions and assertions for visual element interactions
 */
export class BaseVisualSteps<T extends BaseVisualMap = BaseVisualMap> {
	protected visualPage: BaseVisualPage<T>;

	/**
	 * Initialize base visual steps
	 * @param visualPage - Base visual page instance
	 */
	public constructor(visualPage: BaseVisualPage<T>) {
		this.visualPage = visualPage;
	}
}
