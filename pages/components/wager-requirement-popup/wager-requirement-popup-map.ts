import { BaseMap } from "@base/base-map";
import { Locator, Page } from "@playwright/test";

export class WagerRequirementPopupMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get container(): Locator {
		return this.page.getByTestId("wager-req-bar-v4-container");
	}

	public get dragIcon(): Locator {
		return this.container.getByTestId("wager-req-bar-v4-drag-icon");
	}

	public get title(): Locator {
		return this.container.getByTestId("wager-req-bar-v4-title");
	}

	public get activeLabel(): Locator {
		return this.container.getByTestId("wager-req-bar-v4-active-label");
	}

	public get toggleButton(): Locator {
		return this.container.getByTestId("wager-req-bar-v4-toggle-button");
	}

	public get accordionContent(): Locator {
		return this.container.getByTestId("wager-req-bar-v4-accordion-content");
	}

	public get wageredAmount(): Locator {
		return this.container.getByTestId("wager-req-bar-v4-wagered-amount");
	}

	public get targetAmount(): Locator {
		return this.container.getByTestId("wager-req-bar-v4-target-amount");
	}

	public get messageText(): Locator {
		return this.container.getByTestId("wager-req-bar-v4-message-text");
	}

	public get draggableContainer(): Locator {
		return this.page.locator(
			"[class*='DraggableContainer-styled__Container']",
		);
	}
}
