import { OriginalGame } from "@enums/original-games";
import { storageStateNewUserDB } from "@fixtures/auth-fixtures";
import { test } from "@fixtures/fixtures";

const originalGames: OriginalGame[] = [
	OriginalGame.Plinko,
	OriginalGame.Mines,
	OriginalGame.Keno,
];

test.describe("Originals Games - quick select buttons", () => {
	test.use(storageStateNewUserDB());

	for (const game of originalGames) {
		test(
			`[ENG-5455] Quick select button - MIN button, for ${game}`,
			{
				tag: ["@originals"],
			},
			async ({ originalsPage }) => {
				const initialBetAmount = 10;

				await originalsPage.navigateToGame(game);
				await originalsPage.authenticatedHeader
					.assertThat()
					.loggedInUserElementsAreVisible();
				await originalsPage
					.steps()
					.setBetAmount(game, initialBetAmount);
				await originalsPage.steps().pressMinButton(game);
				await originalsPage.assertThat().betAmountIsMin(game);
				await originalsPage.steps().pressMinButton(game);
				await originalsPage.steps().pressHalfButton(game);

				await originalsPage.assertThat().betAmountIsMin(game);
			},
		);
	}
});
