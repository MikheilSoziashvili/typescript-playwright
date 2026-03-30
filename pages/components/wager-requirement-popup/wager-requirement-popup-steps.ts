import { BaseComponentStep } from "@base/base-component-step";
import { expect } from "@playwright/test";
import { step } from "decorators/step";
import { WagerRequirementPopup } from "./wager-requirement-popup";

export class WagerRequirementPopupSteps extends BaseComponentStep<WagerRequirementPopup> {
	public constructor(component: WagerRequirementPopup) {
		super(component);
	}

	@step("Expand popup and verify content")
	public async expandPopupAndVerifyContent(
		expectedMessage: string,
	): Promise<void> {
		await this.component.clickToggleButton();
		await this.component.assertThat().expandedContentIsDisplayed();
		await this.component.assertThat().messageTextIsDisplayed(expectedMessage);
	}

	@step("Drag popup and verify it moved")
	public async dragPopupAndVerifyMoved(
		targetX: number,
		targetY: number,
	): Promise<void> {
		const draggable = this.component.map.draggableContainer;
		const boundingBox = await draggable.boundingBox();
		expect(
			boundingBox,
			"Wager requirement popup is not visible for dragging",
		).not.toBeNull();

		const initialX = boundingBox?.x ?? 0;
		const initialY = boundingBox?.y ?? 0;

		await this.component.dragPopup(targetX, targetY);
		await this.component
			.assertThat()
			.checkElementPositionChanged(
				draggable,
				initialX,
				initialY,
			);
	}
}
